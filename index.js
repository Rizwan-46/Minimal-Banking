let totalUser = []
function unveilTask() {
  const data = JSON.parse(localStorage.getItem('TaskStore'))
  if (data) {
    totalUser = data
  }
}
unveilTask()
// console.log(totalUser)
let foundUser = false
let foundUserIndex = -1
let currentObj = ''
store()
let loginSignupWholeConatiner = document.querySelector('.Login-Signup-whole')
let loginContainer = document.querySelector('.login')
let loginErrorMsg = document.querySelector('.show-login-error')
let signupContainer = document.querySelector('.signup')
let showSignUpFrom = document.querySelector('.show-sign-from')
let showLoginFrom = document.querySelector('.show-login-from')
let logedUsername = document.querySelector('.loged-username')
let logedPassword = document.querySelector('.loged-password')
let submitLogedCredentials = document.querySelector('#submit-loged-credentials')
let sucessMsg = document.querySelector('.success-msg')

// Sign up credential
let mainPageShower = document.querySelector('.main')
// let signupName = document.querySelector('.signup-username')
// let signupEmail = document.querySelector('.signup-email')
// let signupPassword = document.querySelector('.signup-password')
let signUpsubmit = document.querySelector('.signup-submit')
let signerror = document.querySelector('.sign-up-error-msg')

// Transfer Money Inputs
let sumitAmountTransfer = document.querySelector('.sumit-amount-transfer')
let AmountToTansfer = document.querySelector('.amount-Transfer')
let AccountToTansfer = document.querySelector('.account-to-Transfer')
// Request Loan Inputs;
let submitLoanRequest = document.querySelector('.sumit-loan-transfer')
let LoanAmount = document.querySelector('.loan-money-request')
// Bsic Credential i.e Name DIV
let basicBankingCredential = document.querySelector('.container-contain-items')
// Bank Transaction History DIV
let balanceHistory = document.querySelector('.transaction-history')
// Loan History Div conayiner
let loanHistoryItems = document.querySelector('.loan-history-container ')
// Btn Loan Function button
let btnLoan = document.querySelector('.btn-loan')
// Check lock status
let checkLockStatus = document.querySelector('.lock-status')

let msgsOfErrorsAmount = document.querySelector('.display-error-msgs')

function TakingInputsFromTransfer() {
  let currentAmountToTansfer = Number(document.querySelector('.amount-Transfer').value)
  let CurrentAccountToTansfer = document.querySelector('.account-to-Transfer').value
  AmountToTansfer.value = ''
  AccountToTansfer.value = ''
  return [currentAmountToTansfer, CurrentAccountToTansfer]
}

let mainContainer = document.querySelector('.main')
showSignUpFrom.onclick = () => {
  signupContainer.classList.add('active')
  loginContainer.classList.add('inactive')
}
showLoginFrom.onclick = () => {
  signupContainer.classList.remove('active')
  loginContainer.classList.remove('inactive')
}

function LoginChecking() {
  let currentLogedUsername = document.querySelector('.loged-username').value
  let currentLogedPassword = document.querySelector('.loged-password').value

  for (let i in totalUser) {
    if (
      totalUser[i].name === currentLogedUsername &&
      totalUser[i].password === currentLogedPassword
    ) {
      foundUser = true
      foundUserIndex = i
      currentObj = totalUser[i]
      break
    }
  }
}
function bankMainPageShow() {
  loginSignupWholeConatiner.classList.add('inactive')
  mainContainer.classList.add('main-active')
}

submitLogedCredentials.addEventListener('click', (e) => {
  e.preventDefault()
  LoginChecking()
  if (foundUser) {
    // displayMainPage()
    store()
    bankMainPageShow()
    basicCredenUpdateDOM()
    transctionHistoryUpdate()
    loanContainerUpdate()
  } else {
    loginErrorMsg.innerHTML = 'wrong username or password'
    setTimeout(() => {
      loginErrorMsg.innerHTML = ''
    }, 2000)
  }
})
function newSignUp() {
  let currentSignupName = document.querySelector('.signup-username').value
  let currentSignupEmail = document.querySelector('.signup-email').value
  let currentSignupPassword = document.querySelector('.signup-password').value
  let currentAccountNo = document.querySelector('.signup-account-no').value
  if (
    currentSignupName !== '' &&
    currentSignupEmail !== '' &&
    currentSignupPassword !== '' &&
    currentAccountNo !== ''
  ) {
    totalUser.push({
      name: currentSignupName,
      password: currentSignupPassword,
      email: currentSignupEmail,
      AccountNo: currentAccountNo,
      loanCount: 0,
      loan: [],
      balance: 1000,
      history: [],
      lockAccount: true,
    })
    signupContainer.classList.remove('active')
    loginContainer.classList.remove('inactive')
    sucessMsg.innerHTML = 'Sign up successfuly login to get access to account'
    setTimeout(() => {
      sucessMsg.innerHTML = ' '
    }, 4000)
  } else {
    signerror.innerHTML = 'Fill all fields'
    setTimeout(() => {
      signerror.innerHTML = ' '
    }, 2000)
  }
}
signUpsubmit.addEventListener('click', (e) => {
  e.preventDefault()
  store()
  newSignUp()
})
sumitAmountTransfer.addEventListener('click', (e) => {
  e.preventDefault()
  let nowCurrentIndex = -1
  let nowFindIndex = false
  const [balanceToTransfer, AccountToTarnsfer] = TakingInputsFromTransfer()
  console.log(balanceToTransfer, AccountToTarnsfer)
  if (balanceToTransfer !== 0 && AccountToTarnsfer !== '') {
    if (currentObj.lockAccount) {
      transactionErrors('Your Account is locked')
    } else if (currentObj.balance < balanceToTransfer) {
      transactionErrors('Amount Exceed')
    } else {
      for (let j in totalUser) {
        if (totalUser[j].AccountNo === AccountToTarnsfer) {
          nowCurrentIndex = j
          nowFindIndex = true
        }
      }
    }
  } else {
    transactionErrors('Fill the fields')
  }

  if (nowFindIndex) {
    transactionErrors(
      `Amount transfer to ${totalUser[nowCurrentIndex].name} with ${totalUser[nowCurrentIndex].AccountNo}`
    )
    currentObj.balance -= balanceToTransfer
    totalUser[nowCurrentIndex].balance += balanceToTransfer
    currentObj.history.push({ amount: -balanceToTransfer, date: gettingdate() })
    totalUser[nowCurrentIndex].history.push({ amount: balanceToTransfer, date: gettingdate() })
    store()
    basicCredenUpdateDOM()
    transctionHistoryUpdate()
    loanContainerUpdate()
  } else {
    transactionErrors('No account found to transfer')
  }
})
function requestLoanTransfer() {
  let currentLoanAmount = Number(document.querySelector('.loan-money-request').value)
  if (currentObj.lockAccount) {
    transactionErrors('Account is locked')
  } else if (!currentLoanAmount) {
    transactionErrors('Enter amount of loan')
  } else if (currentLoanAmount > 50000) {
    transactionErrors('Too much amount for loan')
  } else {
    currentObj.loanCount++
    currentObj.balance += currentLoanAmount
    currentObj.history.push({ amount: currentLoanAmount, date: gettingdate() })
    currentObj.loan.push({ loanAmount: currentLoanAmount, date: gettingdate(), status: false })
    currentObj.loanCount++
    store()
    basicCredenUpdateDOM()
    transctionHistoryUpdate()
    // transctionHistoryUpdate()
    loanContainerUpdate()
  }
  LoanAmount.value = ''
}
submitLoanRequest.addEventListener('click', (e) => {
  e.preventDefault()
  requestLoanTransfer()
})
function basicCredenUpdateDOM() {
  let date = new Date().getHours()
  let inHTML = `  
        <div class="name-credentail">
            <h2  class="username">${currentObj.name}</h2>
            <p class="message">${
              date < 12
                ? 'Good Morning'
                : date < 15
                ? 'Good afternoon'
                : date < 19
                ? 'Good Evening'
                : 'Good Nigth'
            }</p>
        </div>
        </div>
        <div class="amount-credential">
          <p class= "amount">${currentObj.balance}</p>
          <p class= "lock-status">${
            currentObj.lockAccount ? 'Your Account is Locked' : 'Your Account is Unlock'
          }</p>
        </div>`
  basicBankingCredential.innerHTML = inHTML
}

function transctionHistoryUpdate() {
  balanceHistory.innerHTML = ''
  let iHTML = ''
  if (currentObj.history) {
    for (let i in currentObj.history) {
      iHTML = `
            <div class="transaction-history-items ${
              currentObj.history[i].amount > 0 ? 'deposit' : 'withdraw'
            }">
             <div class="detail-of-transaction">
                <p>${
                  currentObj.history[i].amount > 0
                    ? '<i class="fa-solid fa-arrow-trend-up" style="color: #4aff85;"></i>'
                    : '<i class="fa-solid fa-arrow-trend-down" style="color: #ff0000;"></i>'
                }</p>
                <section>
                <p> ${currentObj.history[i].amount > 0 ? 'Deposit' : 'Widthraw'}</p>
                <p>${currentObj.history[i].date}</p>
                </section>
             </div>
             <div class="detail-of-amount">
                <p>${Math.abs(currentObj.history[i].amount)}</p>
             </div>
            </div>`
      balanceHistory.insertAdjacentHTML('afterbegin', iHTML)
    }
  }
}
function loanContainerUpdate() {
  loanHistoryItems.innerHTML = ''
  let iHTML = ''
  if (currentObj.loan) {
    for (let i in currentObj.loan) {
      iHTML = `<div class="loan-history-items ${
        currentObj.loan[i].status ? 'done-paid' : 'to-be-paid'
      }">
              <div class="detail-of-loan">
                <section>
                  <p>${currentObj.loan[i].loanAmount}</p>
                  <p>${currentObj.loan[i].date}</p>
                </section>
              </div>
              <div class="check-paid status">
                <button ${
                  currentObj.loan[i].status ? 'disabled' : `check-data=${i}`
                } class="btn-loan">${currentObj.loan[i].status ? 'Paid' : 'Pay'}</button>
              </div>
            </div>`

      loanHistoryItems.insertAdjacentHTML('afterbegin', iHTML)
    }
  }
}

function gettingdate() {
  let a = new Date()
  let hs = a.getHours()
  let min = a.getMinutes()
  let mon = a.getMonth() + 1
  let date = a.getDate()
  let year = a.getFullYear()
  let ampm = hs >= 12 ? 'PM' : 'AM'
  hs = hs % 12
  hs = hs ? hs : 12
  hs > 10 ? '0' + hs : hs
  min > 10 ? '0' + min : min
  let time = `${hs} : ${min} ${ampm}`
  return `${time} ${date}-${mon}-${year}`
}

function submitLoan(e) {
  let index = e.target.getAttribute('check-data')
  // alert(index)

  let currentLoanAmount = currentObj.loan[index].loanAmount
  currentObj.balance -= currentLoanAmount
  currentObj.history.push({ amount: -currentLoanAmount, date: gettingdate() })
  currentObj.loan[index].status = true
  store()
  basicCredenUpdateDOM()
  transctionHistoryUpdate()
  loanContainerUpdate()
}
loanHistoryItems.addEventListener('click', submitLoan)
// checkLockStatus.addEventListener(('click', lockAccount))
basicBankingCredential.onclick = (e) => {
  if (e.target.classList.contains('lock-status')) {
    currentObj.lockAccount ? (currentObj.lockAccount = false) : (currentObj.lockAccount = true)
    store()
    basicCredenUpdateDOM()
  }
}

function transactionErrors(msg) {
  msgsOfErrorsAmount.innerHTML = msg
  setTimeout(() => {
    msgsOfErrorsAmount.innerHTML = ''
  }, 4000)
}

function store() {
  localStorage.setItem('TaskStore', JSON.stringify(totalUser))
}
store()
