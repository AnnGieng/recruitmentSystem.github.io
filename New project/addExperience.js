document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('save-experience').addEventListener('click', function () {
        const company = document.getElementById('company').value;
        const role = document.getElementById('role').value;
        const startDate = document.getElementById('start-date').value;

        if (company && role && startDate) {
            const newExperienceDetail = {
                company,
                role,
                startDate
            };
            let applicationData = JSON.parse(localStorage.getItem('applicationData'));
            if (!applicationData.experienceDetails) {
                applicationData.experienceDetails = [];
            }
            applicationData.experienceDetails.push(newExperienceDetail);
            localStorage.setItem('applicationData', JSON.stringify(applicationData));
            window.location.href = 'mainForm.html';
        } else {
            alert('Please fill all fields.');
        }
    });
});
