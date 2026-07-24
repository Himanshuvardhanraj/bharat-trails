document.addEventListener('DOMContentLoaded', function () {
    var alerts = document.querySelectorAll('.flash-messages-container .alert');

    alerts.forEach(function (alertEl, index) {
        setTimeout(function () {
            // Uses Bootstrap's own Alert component so it fades out with the
            // same transition as a manual close, instead of just vanishing.
            var bsAlert = bootstrap.Alert.getOrCreateInstance(alertEl);
            bsAlert.close();
        }, 5000 + index * 300); // stagger slightly if more than one is showing
    });
});