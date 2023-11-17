
export async function post({ request }) {
    const formData = await request.formData();
    // Process your form data here, like storing in a database

    return new Response(JSON.stringify({ message: 'Form submitted successfully' }), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
