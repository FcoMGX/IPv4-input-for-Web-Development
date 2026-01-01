# IPv4 Input Handler

This project provides a robust JavaScript utility to manage, validate, and style IP (IPv4) addresses inputs. It dynamically replaces `<input type="ipv4">` elements with an intuitive, segmented interface for entering and managing IPv4 addresses.

---

## How to use the script

To integrate the IPv4 component into your webpage project, simply include the script in the `<head>` of your HTML document:

```html
<script src="[https://fcomgx.github.io/IPv4-input-for-Web-Development/ipv4Script.js](https://fcomgx.github.io/IPv4-input-for-Web-Development/ipv4Script.js)"></script>

```

Then, use the custom input type in your forms:

```html
<input type="ipv4" name="my_ip_address" id="ip1">

```

## Features

### General Overview

* **Segmentation**: Splits the IP address into 4 distinct input fields (octets) for better UX.
* **Validation**: Ensures that each octet is a number between `0` and `255`.
* **Input Restriction**: Prevents users from entering non-numeric characters.
* **Auto-Focus**: Automatically moves the cursor to the next octet after typing 3 digits or pressing the period key (`.`).
* **Autofill & Paste Support**: Intelligently handles pasting full IP addresses or browser autofill, distributing the values across the octets automatically.
* **Native Error Reporting**: Uses the browser's native constraint validation API (popovers/tooltips) instead of intrusive `alert()` boxes.
* **Multilanguage Support**: Error messages automatically adapt to the user's browser language (Supports: EN, ES, FR, IT, PT, DE, ZH, JA).
* **Dynamic Value Setting**: Enables programmatic setting and retrieval of IPv4 values via JavaScript.

> [!IMPORTANT]
> This utility ensures the integrity of IPv4 inputs by strictly enforcing format rules and synchronising values to a hidden input field for form submission.

---

## Default Styles

The script applies default styles to ensure a clean appearance. You can override these in your own CSS file.

**Default applied styles:**

```css
/* Style for each individual octet */
.ipv4-input {
    width: 35px; /* Can be overridden to 50px for better visibility */
    text-align: center;
}

/* Style for the full IP container */
.ipv4-container {
    display: inline-flex;
    align-items: center;
    width: fit-content;
    vertical-align: middle;
}

/* Style for the separators between octets (" . ") */
.ipv4-container span {
    margin: 0 5px;
}

/* Style for error indication (applied dynamically) */
.ipv4-input.error {
    background-color: #ffcccc;
}

```

---

## Reserved Class Names

Avoid using the following class names in your HTML to prevent conflicts:

* `ipv4-input`
* `ipv4-container`
* `ipv4-hidden-input`

> [!CAUTION]
> Overriding these class names manually may break the script's functionality.

---

## Examples

### Setting and Getting Values

**Using Vanilla JavaScript:**

Set a value (`192.168.1.1`) to an input with a specific **ID** (`myip`):

```javascript
document.getElementById("myip").value = "192.168.1.1";

```

Get the value of an input with a specific **ID** (`myip`):

```javascript
console.log(document.getElementById("myip").value); // Outputs: "192.168.1.1"

```

**Using jQuery:**

The script ensures full compatibility with jQuery's `.val()` method.

Set value by ID:

```javascript
$("#myip").val("10.0.0.5");

```

Get value by ID:

```javascript
const currentIP = $("#myip").val();

```

> [!NOTE]
> The script intelligently handles selectors. Using `document.querySelectorAll(".your-class")` will now only target the visual container, preventing duplicate values in your logic.

### Console Warnings

If you try to set an invalid IP address programmatically via JavaScript (e.g., `999.999.999.999`), the script will:

1. Clear the visual inputs to prevent invalid states.
2. Log a warning in the browser console (mimicking native browser behaviour).

```javascript
document.getElementById("myip").value = "999.0.0.1";
// Console Warning: The specified value '999.0.0.1' is not a valid IPv4 address.

```

### Dynamically Adding IPv4 Inputs

You can dynamically insert inputs into the DOM, and the script will automatically initialise them.

Add an IPv4 input at the end of the body:

```javascript
document.body.insertAdjacentHTML('beforeend', '<input type="ipv4" id="new_ip" name="ip_dynamic">');

```

Add an IPv4 input inside a form:

```javascript
document.querySelector('form').insertAdjacentHTML('beforeend', '<input type="ipv4" name="server_ip">');

```

---

## Form Validation

The script integrates seamlessly with standard HTML forms. When a user attempts to submit a form:

* **Validation**: It checks if all octets are present and within the `0-255` range.
* **Native Feedback**: If an error is found (e.g., a number > 255), the browser will automatically scroll to the field, focus it, and display a native error message (e.g., "Invalid octet") in the user's language.
* **Submission Block**: The form submission is prevented until the error is resolved.

> [!NOTE]
> No extra configuration is needed. Just add `required` to your `<input type="ipv4">` if the field is mandatory.

---

This README provides a detailed overview of the script's functionality. If you encounter any issues or have feature requests, please check the source code or open an issue.
