function openManual() {
    document.getElementById("manualPopup").style.display = "block";
}

function closeManual() {
    document.getElementById("manualPopup").style.display = "none";
}

function openBadges() {
    document.getElementById("badgesPopup").style.display = "block";
}

function closeBadges() {
    document.getElementById("badgesPopup").style.display = "none";
}

document.body.classList.add('popup-active');

function selectMode() {

    document.getElementById('selectionPopup').style.display = 'none';

    document.body.classList.remove('popup-active');
}

function openLogin() {
    document.getElementById("loginPopup").style.display = "block";
}

function closeLogin() {
    document.getElementById("loginPopup").style.display = "none";
}
// Obsługa wprowadzania tekstu w polu input dla kierowców
async function handleDriverInput() {
    const input = document.getElementById("driverInput").value;
    const suggestionList = document.getElementById("suggestionList");

    // Jeśli długość tekstu jest mniejsza niż 2, czyść listę sugestii
    if (input.length < 2) {
        suggestionList.innerHTML = '';
        return;
    }

    try {
        // Wysyłanie zapytania do backendu o sugestie
        const response = await fetch(`/api/game/suggestions?prefix=${encodeURIComponent(input)}`);
        const data = await response.json();

        // Czyszczenie istniejących sugestii
        suggestionList.innerHTML = '';

        // Dodawanie nowych sugestii do listy
        data.suggestions.forEach(driver => {
            const li = document.createElement("li");
            li.textContent = driver;
            li.onclick = () => {
                document.getElementById("driverInput").value = driver;
                suggestionList.innerHTML = '';
            };
            suggestionList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching suggestions:", error);
    }
}
// Przycisk sprawdzania odpowiedzi
const checkButton = document.getElementById("checkButton");
checkButton.onclick = async () => {
    const driverInput = document.getElementById("driverInput").value;
    if (!driverInput) {
        alert("Please enter a driver name.");
        return;
    }

    try {
        // Wysyłanie zgadywania do backendu
        const response = await fetch("/api/game/guess", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ guess: driverInput }),
        });

        const result = await response.json();

        // Obsługa odpowiedzi od backendu
        if (result.correct) {
            alert("Congratulations! You guessed correctly.");
        } else if (result.correct_answer) {
            alert(`Game over! The correct answer was ${result.correct_answer}.`);
        } else {
            // Wyświetl wskazówki
            console.log(result.hints);
        }
    } catch (error) {
        console.error("Error checking guess:", error);
    }
};

// Obsługa wysyłania danych logowania na backend
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
        fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Login successful!');
                    closeLogin();
                    openAdminPanel();
                } else {
                    alert('Invalid username or password!');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred.');
            });
    } else {
        alert('Please fill in both fields!');
    }
});
//TEST ADMINA
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const exampleUsername = "admin";
    const examplePassword = "123456";

    if (username === exampleUsername && password === examplePassword) {
        alert('Login successful!');
        closeLogin();
        openAdminPanel();
    } else {
        alert('Invalid username or password!');
    }
});

let targetDriver = null;

// Pobieranie danych o szukanym kierowcy z backendu
//funkcja dla backend
async function fetchTargetDriver() {
    try {
        const response = await fetch('/api/game/target-driver');
        if (response.ok) {
            targetDriver = await response.json();
        } else {
            console.error("Error with fetching driver.");
        }
    } catch (error) {
        console.error("Server connection error", error);
    }
}
fetch('/api/game/start', {
  method: 'POST'
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.log('Error:', error));

/*
//PRZYKLAD
async function fetchTargetDriver() {
    // Przykładowy szukany kierowca
    targetDriver = {
        id: 1,
        name: 'John Doe',
        age: 30,
        startingNumber: 7,
        nationality: 'American',
        lastTeam: 'Team A',
        numStarts: 50,
        scoredPoints: 100.5,
        numPodiums: 10,
        debutYear: 2015,
    };
}
window.onload = () => {
    fetchTargetDriver();
};
*/

// Podpowiadanie kierowcy
 //funkcja dla backend
async function handleDriverInput() {
    const input = document.getElementById('driverInput').value.trim();
    const suggestionList = document.getElementById('suggestionList');

    if (!input) {
        suggestionList.innerHTML = '';
        return;
    }

    // Wykonanie zapytania do backendu, by znaleźć kierowców
    try {
        const response = await fetch(`/api/admin/drivers?query=${encodeURIComponent(input)}`);
        const drivers = await response.json();

        suggestionList.innerHTML = '';

        if (drivers && Array.isArray(drivers)) {
            drivers.forEach(driver => {
                const li = document.createElement('li');
                li.textContent = driver.name;
                li.onclick = () => selectDriver(driver);
                suggestionList.appendChild(li);
            });
        } else {
            suggestionList.innerHTML = '<li>No results!</li>';
        }

    } catch (error) {
        console.error('Error fetching driver suggestions:', error);
        suggestionList.innerHTML = '<li>No results!</li>';
    }
}

/*
//PRZYKLAD
async function handleDriverInput() {
    const input = document.getElementById('driverInput').value.trim();
    const suggestionList = document.getElementById('suggestionList');

    if (!input) {
        suggestionList.innerHTML = '';
        return;
    }

    const drivers = [
        { id: 1, name: 'John Doe', age: 30, startingNumber: 7, nationality: 'American', lastTeam: 'Team A', numStarts: 50, scoredPoints: 100.5, numPodiums: 10, debutYear: 2015 },
        { id: 2, name: 'Jane Smith', age: 30, startingNumber: 12, nationality: 'British', lastTeam: 'Team A', numStarts: 45, scoredPoints: 120.0, numPodiums: 8, debutYear: 2016 },
    ];

    const filteredDrivers = drivers.filter(driver => driver.name.toLowerCase().includes(input.toLowerCase()));

    suggestionList.innerHTML = '';

    if (filteredDrivers.length > 0) {
        filteredDrivers.forEach(driver => {
            const li = document.createElement('li');
            li.textContent = driver.name;
            li.onclick = () => selectDriver(driver);
            suggestionList.appendChild(li);
        });
    } else {
        suggestionList.innerHTML = '<li>No results!</li>';
    }
}
*/
let currentAttempt = 1;

function selectDriver(driver) {
    const input = document.getElementById('driverInput');
    input.value = driver.name;

    document.getElementById('suggestionList').innerHTML = '';

    if (currentAttempt > 5) {
        alert('You used all the attempts!');
        return;
    }

    const fields = [
        { id: `driverName${currentAttempt}`, value: driver.name, compareField: targetDriver.name },
        { id: `age${currentAttempt}`, value: driver.age, compareField: targetDriver.age },
        { id: `startingNumber${currentAttempt}`, value: driver.startingNumber, compareField: targetDriver.startingNumber },
        { id: `nationality${currentAttempt}`, value: driver.nationality, compareField: targetDriver.nationality },
        { id: `lastTeam${currentAttempt}`, value: driver.lastTeam, compareField: targetDriver.lastTeam },
        { id: `numStarts${currentAttempt}`, value: driver.numStarts, compareField: targetDriver.numStarts },
        { id: `scoredPoints${currentAttempt}`, value: driver.scoredPoints, compareField: targetDriver.scoredPoints },
        { id: `numPodiums${currentAttempt}`, value: driver.numPodiums, compareField: targetDriver.numPodiums },
        { id: `debutYear${currentAttempt}`, value: driver.debutYear, compareField: targetDriver.debutYear }
    ];

        fields.forEach(field => {
            const dataBox = document.getElementById(field.id);
            if (dataBox) {
                dataBox.textContent = field.value;

                if (field.value && field.value.toString().toLowerCase() === field.compareField.toString().toLowerCase()) {
                    dataBox.classList.add('correct');
                    dataBox.classList.remove('incorrect');
                } else {
                    dataBox.classList.add('incorrect');
                    dataBox.classList.remove('correct');
                }
            }
        });

        if (driver.name === targetDriver.name) {
            alert('Congratulations, you guessed the driver!');
            currentAttempt = 6;
        } else {
            currentAttempt++;
        }
}

function openAdminPanel() {
    const adminPanel = document.getElementById('adminPanelPopup');
    if (adminPanel) {
        adminPanel.style.display = 'block';
        fetchDrivers();
    }
}

function closeAdminPanel() {
    const adminPanel = document.getElementById('adminPanelPopup');
    if (adminPanel) {
        adminPanel.style.display = 'none';
    }
    const driverForm = document.getElementById('driverForm');
    if (driverForm) {
        driverForm.reset();
    }
}
 //poprawna funkcja
async function fetchDrivers() {
    try {
        const response = await fetch('/api/admin/drivers');
        const drivers = await response.json();

        const driverList = document.getElementById('driverList');
        driverList.innerHTML = '';

        drivers.forEach(driver => {
            const div = document.createElement('div');
            div.classList.add('driver-item');
            div.innerHTML = `
                <span>${driver.name}</span>
                <button onclick="editDriver(${driver.id})">Edit</button>
                <button onclick="deleteDriver(${driver.id})">Delete</button>
            `;
            driverList.appendChild(div);
        });
    } catch (error) {
        console.error('Error fetching drivers:', error);
    }
}

/*
// Pobieranie zawodnikow test
async function fetchDrivers() {
    const drivers = [
        { id: 1, name: 'John Doe', age: 30, startingNumber: 7, nationality: 'American', lastTeam: 'Team A', numStarts: 50, scoredPoints: 100.5, numPodiums: 10, debutYear: 2015 },
        { id: 2, name: 'Jane Smith', age: 28, startingNumber: 12, nationality: 'British', lastTeam: 'Team B', numStarts: 45, scoredPoints: 120.0, numPodiums: 8, debutYear: 2016 },
    ];

    const driverList = document.getElementById('driverList');
    driverList.innerHTML = '';

    drivers.forEach(driver => {
        const div = document.createElement('div');
        div.classList.add('driver-item');
        div.innerHTML = `
            <div>
                <span>${driver.name}</span>
                <button onclick="editDriver(${driver.id})">Edit</button>
                <button onclick="deleteDriver(${driver.id})">Delete</button>
            </div>
        `;
        driverList.appendChild(div);
    });
}
*/
// Funkcja usuwania juz z api
async function deleteDriver(id) {
    if (!confirm('Are you sure you want to delete this driver?')) return;

    try {
        await fetch(`/api/admin/drivers/${id}`, {
            method: 'DELETE',
        });

        alert('Driver deleted successfully!');
        fetchDrivers();
    } catch (error) {
        console.error('Error deleting driver:', error);
    }
}
// funkcja dla backend
async function editDriver(id) {
    try {
        const response = await fetch(`/api/admin/drivers/${id}`);
        const driver = await response.json();

        document.getElementById('driverId').value = driver.id;
        document.getElementById('driverName').value = driver.name;
        document.getElementById('age').value = driver.age;
        document.getElementById('startingNumber').value = driver.startingNumber;
        document.getElementById('nationality').value = driver.nationality;
        document.getElementById('lastTeam').value = driver.lastTeam;
        document.getElementById('numStarts').value = driver.numStarts;
        document.getElementById('scoredPoints').value = driver.scoredPoints;
        document.getElementById('numPodiums').value = driver.numPodiums;
        document.getElementById('debutYear').value = driver.debutYear;

        openAdminPanel();
    } catch (error) {
        console.error('Error fetching driver:', error);
    }
}
/*
//TEST EDYCJI
async function editDriver(id) {

        const drivers = [
            { id: 1, name: 'John Doe', age: 30, startingNumber: 7, nationality: 'American', lastTeam: 'Team A', numStarts: 50, scoredPoints: 100.5, numPodiums: 10, debutYear: 2015 },
            { id: 2, name: 'Jane Smith', age: 28, startingNumber: 12, nationality: 'British', lastTeam: 'Team B', numStarts: 45, scoredPoints: 120.0, numPodiums: 8, debutYear: 2016 },
        ];

        const driver = drivers.find(driver => driver.id === id);

        document.getElementById('driverId').value = driver.id;
        document.getElementById('driverName').value = driver.name;
        document.getElementById('age').value = driver.age;
        document.getElementById('startingNumber').value = driver.startingNumber;
        document.getElementById('nationality').value = driver.nationality;
        document.getElementById('lastTeam').value = driver.lastTeam;
        document.getElementById('numStarts').value = driver.numStarts;
        document.getElementById('scoredPoints').value = driver.scoredPoints;
        document.getElementById('numPodiums').value = driver.numPodiums;
        document.getElementById('debutYear').value = driver.debutYear;

        openAdminPanel();
}
*/