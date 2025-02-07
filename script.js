function calculateEMI() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100 / 12;
    const loanTenure = parseInt(document.getElementById('loanTenure').value);

    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTenure)) {
        alert('Please enter valid inputs');
        return;
    }

    const emi = (loanAmount * interestRate * Math.pow(1 + interestRate, loanTenure)) / (Math.pow(1 + interestRate, loanTenure) - 1);
    const totalRepayment = emi * loanTenure;
    const totalInterest = totalRepayment - loanAmount;

    document.getElementById('emiResult').innerText = emi.toFixed(2);
    document.getElementById('totalInterest').innerText = totalInterest.toFixed(2);
    document.getElementById('totalRepayment').innerText = totalRepayment.toFixed(2);

    displayLoanDetails(loanAmount, interestRate * 12 * 100, loanTenure);
    generateRepaymentSchedule(loanAmount, interestRate, loanTenure, emi);
}

function displayLoanDetails(loanAmount, interestRate, loanTenure) {
    const loanDetails = `
        <p><strong>Loan Amount:</strong> ₹${loanAmount.toFixed(2)}</p>
        <p><strong>Interest Rate:</strong> ${interestRate.toFixed(2)}% per annum</p>
        <p><strong>Loan Tenure:</strong> ${loanTenure} months</p>
    `;
    document.getElementById('loanDetails').innerHTML = loanDetails;
}

function generateRepaymentSchedule(loanAmount, interestRate, loanTenure, emi) {
    const scheduleTable = document.getElementById('scheduleTable').getElementsByTagName('tbody')[0];
    scheduleTable.innerHTML = '';

    let outstandingBalance = loanAmount;
    for (let month = 1; month <= loanTenure; month++) {
        const interestPayment = outstandingBalance * interestRate;
        const principalPayment = emi - interestPayment;
        outstandingBalance -= principalPayment;

        const row = scheduleTable.insertRow();
        row.insertCell(0).innerText = month;
        row.insertCell(1).innerText = emi.toFixed(2);
        row.insertCell(2).innerText = principalPayment.toFixed(2);
        row.insertCell(3).innerText = interestPayment.toFixed(2);
        row.insertCell(4).innerText = outstandingBalance > 0 ? outstandingBalance.toFixed(2) : '0.00';
    }
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Loan Repayment Schedule', 14, 20);

    const loanAmount = document.getElementById('loanAmount').value;
    const interestRate = document.getElementById('interestRate').value;
    const loanTenure = document.getElementById('loanTenure').value;

    doc.setFontSize(12);
    doc.text(`Loan Amount: ₹${loanAmount}`, 14, 30);
    doc.text(`Interest Rate: ${interestRate}% per annum`, 14, 37);
    doc.text(`Loan Tenure: ${loanTenure} months`, 14, 44);

    const table = document.getElementById('scheduleTable');
    doc.autoTable({
        head: [["Month", "EMI (₹)", "Principal (₹)", "Interest (₹)", "Outstanding Balance (₹)"]],
        body: Array.from(table.querySelectorAll('tbody tr')).map(row => Array.from(row.cells).map(cell => cell.innerText)),
        startY: 50
    });

    doc.save('Repayment_Schedule.pdf');
}
