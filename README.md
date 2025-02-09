# IPv4 Input Handler

This project provides a robust JavaScript utility to manage, validate, and style IPv4 address inputs. It dynamically replaces `<input type="ipv4">` elements with an intuitive interface for entering and managing IPv4 addresses.

---

## Features

### General Overview

- **Validation**: Ensures that each octet in the IPv4 address is a number between `0` and `255`.
- **Input Restriction**: Prevents users from entering non-numeric characters or invalid IP formats.
- **Dynamic Value Setting**: Enables programmatic setting and retrieval of IPv4 values.
- **Form Submission Validation**: Checks the validity of entered IPv4 addresses before form submission and alerts the user if invalid entries exist.
- **Styling**: Applies default styles for a clean and consistent appearance, while allowing user-defined styles.
- **Error Indication**: Highlights invalid octets with a distinct background colour.

> [!IMPORTANT]  
> This utility ensures the integrity of IPv4 address inputs by strictly enforcing validation and formatting rules.

---

## Default Styles

The following styles are applied by default unless overridden:

```css
.ipv4-input {
    width: 35px;
    text-align: center;
}

.ipv4-container {
    display: flex;
    align-items: center;
    width: fit-content;
}

.ipv4-container span {
    margin: 0 5px;
}

.ipv4-input.error {
    background-color: #ffcccc;
}
```

> [!NOTE]  
> The script will automatically apply these styles if none are explicitly defined.

---

## Warnings

> [!WARNING]  
> When retrieving IPv4 values using `document.querySelectorAll(".ipv4-input")`, you will also retrieve the hidden input used for value management. To avoid this, use `document.querySelectorAll("input.ipv4-input")` to ensure you target only the visible inputs.

---

## Reserved Class Names

Avoid using the following class names, as they are reserved by the script and may cause conflicts:

- `ipv4-input`
- `ipv4-container`
- `ipv4-hidden-input`
- `error`

> [!CAUTION]  
> Overriding these classes may lead to unexpected behaviour in the script.

---

## Examples

### Setting and Getting Values

```javascript
// Set a value to an input with a specific ID
document.getElementById("myip").value = "192.168.0.1";

// Get the value of an input with a specific ID
console.log(document.getElementById("myip").value);

// Set the same value to all inputs with a specific class
const value = "127.0.0.1";
document.querySelectorAll("input.direccionIP").forEach(input => input.value = value);

// Get values from all inputs with a specific class
const inputs = document.querySelectorAll("input.direccionIP2");
inputs.forEach(input => console.log(input.value)); // Hidden input values will also appear
```

> [!TIP]  
> Use the `document.querySelectorAll("input.[class]")` approach to avoid retrieving hidden inputs accidentally.

### Dynamically Adding IPv4 Inputs

Add an IPv4 input at the end of the body:

```javascript
document.body.insertAdjacentHTML('beforeend', '<input type="ipv4" id="myip7" class="direccionIP3" name="ip5" /><br /><br />');
```

Add an IPv4 input at the beginning of the body:

```javascript
document.body.insertAdjacentHTML('afterbegin', '<input type="ipv4" id="myip8" class="direccionIP3" name="ip6" /><br /><br />');
```

Add an IPv4 input inside a form at the end:

```javascript
document.querySelector('form').insertAdjacentHTML('beforeend', '<input type="ipv4" id="myip9" class="direccionIP4" name="ip7" /><br /><br />');
```

Add an IPv4 input inside a form at the beginning:

```javascript
document.querySelector('form').insertAdjacentHTML('afterbegin', '<input type="ipv4" id="myip10" class="direccionIP4" name="ip8" /><br /><br />');
```

Add an IPv4 input before a specific element (e.g., a button):

```javascript
document.querySelector('button').insertAdjacentHTML('beforebegin', '<input type="ipv4" id="myip11" class="direccionIP5" name="ip9" /><br /><br />');
```

Add an IPv4 input after a specific element (e.g., a button):

```javascript
document.querySelector('button').insertAdjacentHTML('afterend', '<input type="ipv4" id="myip12" class="direccionIP5" name="ip10" /><br /><br />');
```

Add an IPv4 input inside a specific div (e.g., a div with ID "contenedor"):

```javascript
document.querySelector('#contenedor').insertAdjacentHTML('beforeend', '<input type="ipv4" id="myip13" class="direccionIP6" name="ip11" /><br /><br />');
```

---

## Form Validation

This script validates IPv4 inputs during form submission:

- Ensures that all octets are within the range `0-255`.
- Prevents submission if any IPv4 input contains incomplete or invalid data.
- Converts valid IPv4 inputs into the hidden input for submission.
- Alerts the user with an error message for invalid entries.

> [!NOTE]  
> Form validation ensures no invalid IPv4 address is submitted, maintaining data integrity.

To trigger validation, simply use the standard form submission process, and the script will handle the rest automatically.

---

This README provides a detailed overview of the script's functionality, features, and usage examples. If you have any questions or need further clarification, feel free to reach out!