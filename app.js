// CONTACT CLASS
class Contact {
    constructor (name, number, network) {
        this.name = name;
        this.number = number;
        this.network =network;
    }
}

// UI CLASS
class UI {
    addContactToList(contact) {
        const list = document.getElementById('contact-list');

        // CREATE TR ELEMENT
        const row = document.createElement('tr');
    
        // INSERT COLUMNS
        row.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.number}</td>
            <td>${contact.network}</td>
            <td><a href="#" class="delete">X</a></td>
        `;
    
        list.appendChild(row);
    }

    showAlert(message, className) {
        // CREATE DIV
        const div = document.createElement('div');

        // ADD CLASSES
        div.className = `alert ${className}`;

        // ADD TEXT
        div.appendChild(document.createTextNode(message));

        // GET PARENT
        const container = document.querySelector('.input-tab');

        // GET FORM
        const form = document.querySelector('#contact-form');

        // INSERT ALERT
        container.insertBefore(div, form);

        // TIMEOUT AFTER 3 SECONDS
        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteContact(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        document.getElementById('name').value = '';
        document.getElementById('number').value = '';
        document.getElementById('network').value = '';
    }
}

// LOCAL STORAGE CLASS
class Store {
    static getContacts() {
        let contacts;
        if (localStorage.getItem('contacts') === null) {
            contacts = [];
        } else {
            contacts = JSON.parse(localStorage.getItem('contacts'));
        }

        return contacts;
    }

    static displayContacts() {
        const contacts = Store.getContacts();

        contacts.forEach(function (contact) {
            const ui = new UI;

            // ADD CONTACT TO UI
            ui.addContactToList(contact);
        });
    }

    static addContact(contact) {
        const contacts = Store.getContacts();

        contacts.push(contact);

        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    static removeContact(network) {
        const contacts = Store.getContacts();

        contacts.forEach(function(contact, index) {
            if(contact.network === network) {
                contacts.splice(index, 1);
            }
        });

        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
}

// DOM LOAD EVENT
document.addEventListener('DOMContentLoaded', Store.displayContacts);

// EVENT LISTENER TO ADD A CONTACT
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function(e) {
    // GET FORM VALUES
    const name = document.getElementById('name').value,
          number = document.getElementById('number').value,
          network = document.getElementById('network').value;

    // INSTANTIATE A CONTACT
    const contact = new Contact(name, number, network);

    // INSTANTIATE UI
    const ui = new UI();

        // VALIDATE UI
        if (name === '' || network === '' || network === '') {
            // ERROR ALERT
            ui.showAlert('Please fill in all fields', 'error');
        } else {
            // ADD CONTACT TO LIST
            ui.addContactToList(contact);
    
            // ADD CONTACT TO LOCAL STORAGE
            Store.addContact(contact);
    
            // SUCESS ALERT
            ui.showAlert('Contact Added!', 'success');
    
            // CLEAR FIELDS
            ui.clearFields();
        }
    
        e.preventDefault();

});

// EVENT LISTENER FOR DELETE CONTACT
document.getElementById('contact-list').addEventListener('click', function(e){
    // INSTANTIATE UI
    const ui = new UI();

    // DELETE CONTACT
    ui.deleteContact(e.target);

    // REMOVE FROM LOCAL STORAGE
    Store.removeContact(e.target.parentElement.previousElementSibling.textContent);

    // SHOW ALERT
    ui.showAlert('Contact Deleted', 'success');

    e.preventDefault();
});