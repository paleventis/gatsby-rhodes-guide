// Multi-language data for useful numbers
const usefulNumbersData = {
  en: {
    emergency: {
      title: "Emergency & Security",
      numbers: [
        { service: "Police (Rhodes)", phone: "100 / 22410 23849" },
        { service: "Tourist Police", phone: "22410 27423" },
        { service: "General Hospital of Rhodes", phone: "22410 80000" },
        { service: "Port Authority of Rhodes", phone: "22410 22220" },
        { service: "Rhodes Airport (Diagoras)", phone: "22410 88700" },
        { service: "Fire Department", phone: "199" },
        { service: "Ambulance (EKAB)", phone: "166" }
      ]
    },
    services: {
      title: "Services",
      numbers: [
        { service: "Security/Passport Office", phone: "22410 24138" },
        { service: "Emergency Doctor", phone: "+306934889551" },
        { service: "Lawyer", phone: "+306948404427" },
        { service: "Radio Taxi Rhodes", phone: "22410 69700 / 22410 69600" }
      ]
    }
  },
  fr: {
    emergency: {
      title: "Urgences & Sécurité",
      numbers: [
        { service: "Police (Rhodes)", phone: "100 / 22410 23849" },
        { service: "Police Touristique", phone: "22410 27423" },
        { service: "Hôpital Général de Rhodes", phone: "22410 80000" },
        { service: "Autorité Portuaire de Rhodes", phone: "22410 22220" },
        { service: "Aéroport de Rhodes (Diagoras)", phone: "22410 88700" },
        { service: "Pompiers", phone: "199" },
        { service: "Ambulance (EKAB)", phone: "166" }
      ]
    },
    services: {
      title: "Services",
      numbers: [
        { service: "Bureau de Sécurité/Passeport", phone: "22410 24138" },
        { service: "Médecin d'Urgence", phone: "+306934889551" },
        { service: "Avocat", phone: "+306948404427" },
        { service: "Taxi Radio Rhodes", phone: "22410 69700 / 22410 69600" }
      ]
    }
  },
  de: {
    emergency: {
      title: "Notfall & Sicherheit",
      numbers: [
        { service: "Polizei (Rhodos)", phone: "100 / 22410 23849" },
        { service: "Tourismuspolizei", phone: "22410 27423" },
        { service: "Allgemeines Krankenhaus Rhodos", phone: "22410 80000" },
        { service: "Hafenbehörde Rhodos", phone: "22410 22220" },
        { service: "Flughafen Rhodos (Diagoras)", phone: "22410 88700" },
        { service: "Feuerwehr", phone: "199" },
        { service: "Krankenwagen (EKAB)", phone: "166" }
      ]
    },
    services: {
      title: "Dienstleistungen",
      numbers: [
        { service: "Sicherheits-/Passbüro", phone: "22410 24138" },
        { service: "Notarzt", phone: "+306934889551" },
        { service: "Anwalt", phone: "+306948404427" },
        { service: "Funktaxi Rhodos", phone: "22410 69700 / 22410 69600" }
      ]
    }
  }
};

// Get current language from localStorage
let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';

// Load and display numbers on page load
window.addEventListener('load', function() {
  displayNumbers();
});

function displayNumbers() {
  const data = usefulNumbersData[currentLanguage];
  const container = document.getElementById('numbers-container');
  container.innerHTML = '';

  // Display Emergency & Security section
  const emergencyTitle = document.createElement('div');
  emergencyTitle.className = 'category-title';
  emergencyTitle.textContent = data.emergency.title;
  container.appendChild(emergencyTitle);

  data.emergency.numbers.forEach(item => {
    const tab = document.createElement('div');
    tab.className = 'number-tab';
    tab.innerHTML = `
      <h3>${item.service}</h3>
      <p><strong>📞 ${item.phone}</strong></p>
    `;
    container.appendChild(tab);
  });

  // Display Services section
  const servicesTitle = document.createElement('div');
  servicesTitle.className = 'category-title';
  servicesTitle.textContent = data.services.title;
  container.appendChild(servicesTitle);

  data.services.numbers.forEach(item => {
    const tab = document.createElement('div');
    tab.className = 'number-tab';
    tab.innerHTML = `
      <h3>${item.service}</h3>
      <p><strong>📞 ${item.phone}</strong></p>
    `;
    container.appendChild(tab);
  });
}

function goBack() {
  window.location.href = 'index.html';
}
