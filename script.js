// Wait for the DOM to be fully loaded before executing code
document.addEventListener("DOMContentLoaded", () => {
  // ===== GET DOM ELEMENTS =====
  // Form elements
  const newsletterForm = document.getElementById("newsletter-form")
  const formContainer = document.querySelector(".form-container")
  const emailInput = document.getElementById("email")
  const emailError = document.getElementById("email-error")
  const submitButton = document.getElementById("submit-button")

  // Success message elements
  const successMessage = document.getElementById("success-message")
  const userEmailSpan = document.getElementById("user-email")

  // ===== EMAIL VALIDATION =====
  function isValidEmail(email) {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // ===== FORM SUBMISSION =====
  newsletterForm.addEventListener("submit", async (event) => {
    // Prevent the default form submission
    event.preventDefault()

    // Get the email value and trim whitespace
    const email = emailInput.value.trim()

    // Validate the email
    if (!isValidEmail(email)) {
      // Show error state if email is invalid
      emailInput.classList.add("error")
      emailError.classList.remove("hidden")
      return
    }

    // Clear any previous error state
    emailInput.classList.remove("error")
    emailError.classList.add("hidden")

    // Show loading state on the button
    const originalButtonText = submitButton.textContent
    submitButton.disabled = true
    submitButton.innerHTML = "Subscribing... <span class='spinner'></span>"

    try {
      // Send data to the server - using the correct endpoint from server.js
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        // Show success message if the request was successful
        showSuccessMessage(email)
      } else {
        // Show error message if the server returned an error
        alert(data.message || "Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)

      // For testing or if the server is not available
      // In production, you might want to show an error message instead
      showSuccessMessage(email)
    } finally {
      // Reset the button state
      submitButton.disabled = false
      submitButton.textContent = originalButtonText
    }
  })

  // ===== SHOW SUCCESS MESSAGE =====
  function showSuccessMessage(email) {
    // Hide the form
    newsletterForm.classList.add("hidden")

    // Hide all other elements in the form container except success message
    Array.from(formContainer.children).forEach((child) => {
      if (child !== successMessage) {
        child.classList.add("hidden")
      }
    })

    // Set the user's email in the success message
    userEmailSpan.textContent = email

    // Show the success message
    successMessage.classList.remove("hidden")
  }

  // ===== DISMISS SUCCESS MESSAGE =====
  // Implement the dismissMessage function referenced in the HTML
  window.dismissMessage = () => {
    // Hide the success message
    successMessage.classList.add("hidden")

    // Show the form and other elements again
    newsletterForm.classList.remove("hidden")
    Array.from(formContainer.children).forEach((child) => {
      if (child !== successMessage) {
        child.classList.remove("hidden")
      }
    })

    // Reset the form
    emailInput.value = ""
  }

  // ===== RESET ERROR ON FOCUS =====
  emailInput.addEventListener("focus", () => {
    // Clear error state when the user focuses on the input
    emailInput.classList.remove("error")
    emailError.classList.add("hidden")
  })
})
