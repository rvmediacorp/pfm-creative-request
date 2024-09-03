document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form[name="creative-request-form"]');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Convert checkboxes and multi-selects to arrays
        data.testing_media_buyers = formData.getAll('testing_media_buyers');
        data.format = formData.getAll('format');

        try {
            const response = await fetch('/.netlify/functions/server', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Form submitted successfully!');
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting the form.');
        }
    });
});
