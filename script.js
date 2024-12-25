// Elements
const buyServiceButton = document.getElementById("buyServiceButton");
const closeModalButton = document.getElementById("closeModalButton");

const modal = document.getElementById("modal");
const userForm = document.getElementById("userForm");
const applyCouponBtn = document.getElementById("apply-coupon");
const couponInput = document.getElementById("coupon");
const formHeader = document.getElementById("form-header");

//error elements
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const mobileError = document.getElementById("mobile-error");
const couponError = document.getElementById("coupon-error");
const ShowTotalAmount = document.getElementById("total-amount");
let discountAmount = null;
// hardcode amount
const originalAmount = 3500;

// Show modal
buyServiceButton.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

// Hide modal
closeModalButton.addEventListener("click", () => {
  userForm.reset();
  ShowTotalAmount.textContent = `${originalAmount.toFixed(2)}`;
  modal.classList.add("hidden");
});

// Show discount price  XMAS2024
applyCouponBtn.addEventListener("click", async (e) => {
  ShowTotalAmount.classList.remove("font-bold");
  ShowTotalAmount.textContent = "Please wait...";
  const couponCode = document.getElementById("coupon").value.trim();

  e.preventDefault();

  if (couponCode.length >= 8 && couponCode) {
    const response = await axios.get("./coupons.json");
    const coupons = response.data.coupons;
    const validCoupon = coupons.find((coupon) => coupon.code === couponCode);

    if (validCoupon) {
      discountPercentage = validCoupon.discount;
      discountPrice =
        originalAmount - (originalAmount * discountPercentage) / 100;
      // Last amount
      discountAmount = discountPrice;
      ShowTotalAmount.classList.add("font-bold");
      ShowTotalAmount.textContent = `₹ ${discountPrice.toFixed(2)}`;
    } else {
      couponError.textContent = "Please enter a valid coupon code!";
      userForm.coupon.value = "";
      ShowTotalAmount.classList.add("font-bold");
      ShowTotalAmount.textContent = `${originalAmount.toFixed(2)}`;

      return;
    }
  } else {
    couponError.textContent = "Please enter a valid coupon code!";
    userForm.coupon.value = "";
    ShowTotalAmount.classList.add("font-bold");
    ShowTotalAmount.textContent = `${originalAmount.toFixed(2)}`;
  }
});

// Handle form submission
let debounceTimer;
userForm.addEventListener("submit", (e) => {
  e.preventDefault();

  formHeader.textContent = "Please wait...";

  // clear any existing timer
  clearTimeout(debounceTimer);

  // Set new debounce timer
  debounceTimer = setTimeout(() => {
    handleSubmit();
  }, 2000);
});

async function handleSubmit() {
  const name = userForm.name.value.trim();
  const email = userForm.email.value.trim();
  const mobile = userForm.mobile.value.trim();
  const couponCode = document.getElementById("coupon").value.trim();

  // console.log({ name, email, mobile, couponCode });
  if (!name || !name.length > 20 || !/^[a-zA-Z]+$/.test(name)) {
    nameError.textContent = "Please enter valid name.";
    return;
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    emailError.textContent = "Please enter a valid email address.";
    return;
  }

  if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
    mobileError.textContent = "Please enter a valid mobile number.";
    return;
  }

  const access_key = "f7ceebc0-a02d-4d35-be0e-855b679da0ff";
  const data = JSON.stringify({
    name,
    mobile,
    email,
    couponCode,
    Amount: discountAmount || originalAmount,
    access_key,
  });

  // return
  axios
    .post("https://api.web3forms.com/submit", data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          title: "Form Submitted!",
          text: `Thank you, ${name}! Your details have been submitted.`,
          icon: "success",
          confirmButtonText: "OK",
        });

        modal.classList.add("hidden");
        ShowTotalAmount.textContent = `${originalAmount.toFixed(2)}`;
        discountAmount = null;
        userForm.reset();
      } else {
        Swal.fire({
          title: "Form submission failed",
          text:
            response.data.message ||
            "An error occurred while submitting the form.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        title: "Form submission failed",
        text:
          response.data.message ||
          "An error occurred while submitting the form.",
        icon: "success",
        confirmButtonText: "OK",
      });
    });
}

  const menuButton = document.getElementById("menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  menuButton.addEventListener("click", () => {
    if (mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.remove("hidden");
      mobileMenu.classList.add("animate-slide-down");
    } else {
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("animate-slide-down");
    }
  });

