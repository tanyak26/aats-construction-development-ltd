const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const enquiryForm = document.querySelector("[data-enquiry-form]");

if (enquiryForm) {
  const status = enquiryForm.querySelector("[data-form-status]");
  const recipient = "info@aatsconstruction.co.uk";

  enquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(enquiryForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const projectType = String(formData.get("project_type") || "").trim();
    const propertyUse = String(formData.get("property_use") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = `Website enquiry from ${name || "AATS website visitor"}`;
    const body = [
      "Hello AATS Construction and Development Ltd,",
      "",
      "I would like to make a property or construction enquiry.",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Property or project type: ${projectType || "Not selected"}`,
      `Property use: ${propertyUse || "Not selected"}`,
      `Project location: ${location || "Not provided"}`,
      "",
      "Message:",
      message,
      "",
      "Thank you.",
    ].join("\n");

    const mailLink = document.createElement("a");
    mailLink.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    mailLink.style.display = "none";
    document.body.appendChild(mailLink);
    mailLink.click();
    mailLink.remove();

    if (status) {
      status.textContent = `Your email app should now open with the enquiry prepared. Please check the To field says ${recipient}, then press send.`;
      status.className = "form-status is-success";
    }
  });
}
