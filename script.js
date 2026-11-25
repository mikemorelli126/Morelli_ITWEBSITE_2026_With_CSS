/* JavaScript interactions for Michael's IT Portfolio */
document.addEventListener("DOMContentLoaded", () => {
    // Responsive mobile navigation.
    const menuButton = document.querySelector(".nav-toggle");
    const navigation = document.querySelector("#primary-navigation");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            const expanded = menuButton.getAttribute("aria-expanded") === "true";
            menuButton.setAttribute("aria-expanded", String(!expanded));
            navigation.classList.toggle("is-open", !expanded);
        });

        navigation.addEventListener("click", (event) => {
            if (event.target.closest("a")) {
                menuButton.setAttribute("aria-expanded", "false");
                navigation.classList.remove("is-open");
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
                menuButton.setAttribute("aria-expanded", "false");
                navigation.classList.remove("is-open");
                menuButton.focus();
            }
        });
    }

    // Requirement 1: a click event visibly changes page content.
    const messageButton = document.querySelector("#message-button");
    const messageOutput = document.querySelector("#message-output");
    if (messageButton && messageOutput) {
        const messages = [
            "JavaScript makes web pages interactive!",
            "You clicked the button. The page content changed.",
            "Event listeners respond to actions from visitors."
        ];
        let messageIndex = 0;

        messageButton.addEventListener("click", () => {
            messageOutput.textContent = messages[messageIndex];
            messageIndex = (messageIndex + 1) % messages.length;
        });
    }

    // Requirement 2: update preview styles and content on every input event.
    const liveInput = document.querySelector("#live-input");
    const livePreview = document.querySelector("#live-preview");
    const previewText = document.querySelector("#preview-text");
    if (liveInput && livePreview && previewText) {
        liveInput.addEventListener("input", () => {
            const enteredText = liveInput.value.trim();
            previewText.textContent = enteredText || "Your live preview will appear here.";
            livePreview.classList.toggle("has-content", enteredText.length > 0);
        });
    }

    // Requirement 3: create list items with createElement() and appendChild().
    const itemForm = document.querySelector("#item-form");
    const itemInput = document.querySelector("#item-input");
    const dynamicList = document.querySelector("#dynamic-list");

    if (itemForm && itemInput && dynamicList) {
        itemForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const itemText = itemInput.value.trim();
            if (!itemText) {
                itemInput.focus();
                return;
            }

            const emptyMessage = dynamicList.querySelector(".list-empty");
            if (emptyMessage) emptyMessage.remove();

            const listItem = document.createElement("li");
            listItem.className = "dynamic-list-item";

            const itemLabel = document.createElement("span");
            itemLabel.textContent = itemText;

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "remove-item-button";
            removeButton.textContent = "Remove";
            removeButton.setAttribute("aria-label", "Remove " + itemText);
            removeButton.addEventListener("click", () => {
                listItem.remove();
                if (dynamicList.children.length === 0) {
                    const emptyItem = document.createElement("li");
                    emptyItem.className = "list-empty";
                    emptyItem.textContent = "Your list is empty. Add your first item!";
                    dynamicList.appendChild(emptyItem);
                }
            });

            listItem.appendChild(itemLabel);
            listItem.appendChild(removeButton);
            dynamicList.appendChild(listItem);
            itemInput.value = "";
            itemInput.focus();
        });
    }

    // Accessible required-field validation on the contact page.
    const contactForm = document.querySelector("#contact-form");
    if (contactForm) {
        const fieldNames = ["name", "email", "message"];
        const validate = (field) => {
            let errorText = "";
            const value = field.value.trim();
            if (!value) {
                errorText = "This field is required.";
            } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errorText = "Enter a valid email address.";
            }
            const errorElement = document.querySelector("#" + field.id + "-error");
            if (errorElement) errorElement.textContent = errorText;
            field.setAttribute("aria-invalid", errorText ? "true" : "false");
            return errorText === "";
        };

        fieldNames.forEach((fieldName) => {
            const field = contactForm.elements.namedItem(fieldName);
            if (!field) return;
            field.addEventListener("blur", () => validate(field));
            field.addEventListener("input", () => {
                if (field.getAttribute("aria-invalid") === "true" || field.value.trim() !== "") {
                    validate(field);
                }
            });
        });

        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const valid = fieldNames
                .map((fieldName) => {
                    const field = contactForm.elements.namedItem(fieldName);
                    return field ? validate(field) : false;
                })
                .every(Boolean);
            const status = document.querySelector("#form-status");
            if (!valid) {
                if (status) status.textContent = "Please correct the highlighted fields before submitting.";
                contactForm.querySelector('[aria-invalid="true"]')?.focus();
                return;
            }
            if (status) {
                status.textContent = "All fields are valid. This demonstration form does not send messages yet; please use the email or phone number above.";
            }
        });
    }

    // Load public GitHub profile data on the contact page when its card exists.
    const profileCard = document.querySelector("#github-profile");
    if (profileCard) {
        const status = document.querySelector("#github-status");
        const details = document.querySelector("#github-details");

        fetch("https://api.github.com/users/mikemorelli126", {
            headers: { Accept: "application/vnd.github+json" }
        })
            .then((response) => {
                if (!response.ok) throw new Error("GitHub API request failed: " + response.status);
                return response.json();
            })
            .then((profile) => {
                const heading = document.createElement("h3");
                heading.textContent = profile.name || profile.login;
                const bio = document.createElement("p");
                bio.textContent = profile.bio || "Public GitHub profile.";
                const stats = document.createElement("p");
                stats.textContent = profile.public_repos + " public repositories · " + profile.followers + " followers";
                const link = document.createElement("a");
                link.href = profile.html_url;
                link.textContent = "View GitHub profile";
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                details.replaceChildren(heading, bio, stats, link);
                status.textContent = "Live GitHub profile loaded.";
            })
            .catch(() => {
                status.textContent = "GitHub profile could not be loaded right now. Please try again later.";
            });
    }
});
