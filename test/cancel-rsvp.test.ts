import { describe, it, expect, vi, afterEach } from "vitest";
import { POST as cancel_rsvp } from '~/pages/cancel-rsvp'; // Adjust the import path
import { supabase } from '~/supabase';

const email = 'jane@example.com';
const baseUrl = 'http://example.com';

describe("POST Endpoint for Cancel RSVP", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.only("should call cancelRSVP and onRSVPCancelled with correct email", async () => {
    // Mock supabase
    const dbResponse = { data: [{ id: 'mock-id' }], error: null };
    const singleMock = vi.fn().mockReturnValueOnce(dbResponse);
    const eqMock = vi.fn().mockReturnValueOnce({ single: singleMock });
    const selectMock = vi.fn().mockReturnValueOnce({ eq: eqMock });
    const fromMock = vi.spyOn(supabase, 'from').mockImplementationOnce(() => ({
      select: selectMock,
      url: new URL('http://example.com'),
      headers: {},
      insert: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    } as any));

    // Mock Telegram
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
    globalThis.fetch = mockFetch;

    // Create a mock request
    const formData = new URLSearchParams({ email });
    const request = new Request(`${baseUrl}/cancel-rsvp`, { method: 'POST', body: formData });

    // Call the cancel_rsvp function
    const response = await cancel_rsvp({ request });

    // Assertions for supabase interaction
    expect(fromMock).toHaveBeenCalledWith('rsvps');
    expect(selectMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith('email', email);
    expect(singleMock).toHaveBeenCalled();

    // Assertions for Telegram interaction
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('telegram.org'), expect.any(Object));

    // Assertions for response
    expect(response.status).toBe(303);
    expect(response.headers.get('Location')).toBe('/');
  });
});
