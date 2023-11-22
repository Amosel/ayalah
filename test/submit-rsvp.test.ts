import { describe, it, expect, vi, afterEach, assert } from "vitest";
import sgrid from '@sendgrid/mail';
import { createClient } from '@supabase/supabase-js';
import { RSVPForm, toFormData, toRsvpRecord } from "~/schema";
import { supabase } from '~/supabase'
import { email_template, telegran_new_rsvp_template } from "~/data";
import { POST as submit_rsvp } from "~/pages/submit-rsvp"; // Adjust the import path for your endpoint
import { POST as cancel_rsvp } from "~/pages/cancel-rsvp"; // Adjust the import path for your endpoint

const baseUrl = "http://example.com"
const email = "jane@example.com";
const name = "Jane Doe";

describe("POST Endpoint Integration Test", () => {

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it("should handle valid RSVP submission correctly", async () => {
    const db_response = { data: [{ id: 'mock-id' }], error: null };
    const selectMock = vi.fn().mockResolvedValueOnce(db_response);
    const upsertMock = vi.fn().mockImplementationOnce(() => ({ select: selectMock }));
    const fromMock = vi.fn().mockImplementationOnce(() => ({ upsert: upsertMock }));
    vi.spyOn(supabase, 'from').mockImplementationOnce(fromMock);

    const sendGridSendMock = vi.fn().mockResolvedValueOnce({ statusCode: 200 });
    vi.spyOn(sgrid, 'send').mockImplementationOnce(sendGridSendMock);
    let form: RSVPForm = {
      name,
      email,
      attendees: 2,
      dish: "",
      games: true,
    };
    const formData = toFormData(form);

    const mockFetch = vi.fn().mockResolvedValue({
      // Mock the response object
      ok: true,
      json: () => Promise.resolve({ /* mocked response body */ }),
    });
    globalThis.fetch = mockFetch;

    // Simulate a POST request
    const url = new URL(`${baseUrl}/submit-rsvp`);
    const response = await submit_rsvp({
      request: new Request(url, {
        method: "POST",
        body: formData,
      }),
    });

    expect(fromMock).toHaveBeenCalledWith("rsvps");
    expect(upsertMock).toHaveBeenCalledWith([toRsvpRecord(form)], { onConflict: "email" });
    expect(selectMock).toHaveBeenCalled();
    expect(sendGridSendMock).toHaveBeenCalledWith(email_template(email))
    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch.mock.calls[0][0]).toEqual("https://api.telegram.org/botundefined/sendMessage");
    expect(JSON.parse(mockFetch.mock.calls[0][1].body)).toEqual({
      text: telegran_new_rsvp_template({ name, url: `${baseUrl}/rsvps` }),
      chat_id: import.meta.env.TELEGRAM_CHAT_ID,
      parse_mode: 'HTML',
    }
    );
    expect(response.status).toBe(303);
  });
});
