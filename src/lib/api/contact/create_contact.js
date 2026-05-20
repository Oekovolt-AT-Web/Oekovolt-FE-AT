export async function submitContact(formData) {
    const url = '/api/create_contact';
    
    try {
               
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });


        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to submit contact form: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Error submitting contact form:", error);
        throw error;
    }
}