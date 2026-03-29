// Kørekort priser fra forskellige kørekortsskoler i danske byer
// BEMÆRK: Opdater priser og skoler med de rigtige data fra deres hjemmesider
const citiesData = [
    {
        id: 1,
        name: "Aarhus",
        region: "Midtjylland",
        schools: [
            { name: "Aarhus Køreskole", price: 4200, rating: 4.3 },
            { name: "Midtjyllands Kørekort", price: 4100, rating: 4.2 }
        ]
    },
    {
        id: 2,
        name: "Odense",
        region: "Fyn",
        schools: [
            { name: "Odense Køreskole", price: 3800, rating: 4.2 },
            { name: "Fyn Kørekort", price: 3900, rating: 4.1 }
        ]
    },
    {
        id: 3,
        name: "Aalborg",
        region: "Nordjylland",
        schools: [
            { name: "Aalborg Køreskole", price: 3950, rating: 4.1 },
            { name: "Nordjyllands Kørekort", price: 4050, rating: 4.0 }
        ]
    },
    {
        id: 4,
        name: "Randers",
        region: "Midtjylland",
        schools: [
            { name: "Køreskoleklubben", price: 14995, rating: 4.5 },
            { name: "Martins Køreakademi", price: 14995, rating: 4.3 },
            { name: "Lisbeths Køreskole", price: 15000, rating: 4.0 },
            { name: "City Køreskolen", price: 15900, rating: 4.2 },
            { name: "R2 Drive", price: 16499, rating: 4.4 },
            { name: "Nordbyens Køreskole", price: 17200, rating: 3.9 },
            { name: "Din og Min Køreskole", price: 17600, rating: 4.1 },
            { name: "Wolff's Køreskole", price: 18000, rating: 3.8 }
        ]
    },
    {
        id: 5,
        name: "Esbjerg",
        region: "Syddanmark",
        schools: [
            { name: "Esbjerg Køreskole", price: 3700, rating: 3.9 }
        ]
    },
    {
        id: 6,
        name: "Silkeborg",
        region: "Midtjylland",
        schools: [
            { name: "Silkeborg Køreskole", price: 3550, rating: 4.2 }
        ]
    },
    {
        id: 7,
        name: "Viborg",
        region: "Midtjylland",
        schools: [
            { name: "Viborg Køreskole", price: 3450, rating: 4.0 }
        ]
    },
    {
        id: 8,
        name: "Vejle",
        region: "Syddanmark",
        schools: [
            { name: "Vejle Køreskole", price: 3800, rating: 4.1 }
        ]
    },
    {
        id: 9,
        name: "Roskilde",
        region: "Hovedstaden",
        schools: [
            { name: "Roskilde Køreskole", price: 4100, rating: 4.2 }
        ]
    },
    {
        id: 10,
        name: "Svendborg",
        region: "Fyn",
        schools: [
            { name: "Svendborg Køreskole", price: 3600, rating: 4.0 }
        ]
    },
    {
        id: 11,
        name: "Kolding",
        region: "Syddanmark",
        schools: [
            { name: "Kolding Køreskole", price: 3750, rating: 4.1 }
        ]
    }
];
