function calculateEMI() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100 / 12;
    const loanTenure = parseInt(document.getElementById('loanTenure').value);

    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTenure)) {
        alert('Please fill all fields correctly.');
        return;
    }

    const emi = (loanAmount * interestRate * Math.pow(1 + interestRate, loanTenure)) / (Math.pow(1 + interestRate, loanTenure) - 1);
    const totalRepayment = emi * loanTenure;
    const totalInterest = totalRepayment - loanAmount;

    document.getElementById('emiResult').innerText = emi.toFixed(2);
    document.getElementById('totalInterest').innerText = totalInterest.toFixed(2);
    document.getElementById('totalRepayment').innerText = totalRepayment.toFixed(2);

    generateRepaymentSchedule(loanAmount, interestRate, emi, loanTenure);
}

function generateRepaymentSchedule(principal, monthlyRate, emi, months) {
    const tableBody = document.querySelector('#scheduleTable tbody');
    tableBody.innerHTML = '';
    let outstanding = principal;

    for (let i = 1; i <= months; i++) {
        const interest = outstanding * monthlyRate;
        const principalPayment = emi - interest;
        outstanding -= principalPayment;

        const row = `
            <tr>
                <td>${i}</td>
                <td>${emi.toFixed(2)}</td>
                <td>${principalPayment.toFixed(2)}</td>
                <td>${interest.toFixed(2)}</td>
                <td>${outstanding > 0 ? outstanding.toFixed(2) : '0.00'}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    }
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text('Repayment Schedule', 14, 20);
    doc.autoTable({
        html: '#scheduleTable',
        startY: 30,
        theme: 'striped'
    });

    doc.save('repayment_schedule.pdf');
}
