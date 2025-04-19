// var map = new ol.Map({
//     target: 'map',
//     layers: [
//         new ol.layer.Tile({
//             source: new ol.source.XYZ({
//                 url: 'https://{a-d}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
//                 maxZoom: 19
//             })
//         })
//     ],
//     view: new ol.View({
//         center: ol.proj.fromLonLat([39.712567, 47.236597]),
//         zoom: 13, 
//         minZoom: 2
//     })
// });

// var markerElement = document.createElement('div');
// markerElement.className = 'marker';
// markerElement.innerHTML = '';

// var markerOverlay = new ol.Overlay({
//     element: markerElement,
//     positioning: 'center-center',
//     stopEvent: false
// });
// map.addOverlay(markerOverlay);

// map.on('click', function (e) {
//     var coordinates = e.coordinate;
//     markerOverlay.setPosition(coordinates);

//     var lonLat = ol.proj.toLonLat(coordinates);
//     var lon = lonLat[0].toFixed(6);
//     var lat = lonLat[1].toFixed(6);

//     console.log(lon);
//     console.log(lat);

//     fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`)
//         .then(response => response.json())
//         .then(data => {
//             var address = data.display_name;
//             document.getElementById('login-address').value = address;
//             console.log('Адрес: ' + address);
//         })
//         .catch(err => {
//             console.error('Ошибка при получении адреса:', err);
//         });
// });


// map.getLayers().forEach(function(layer) {
//     layer.getSource().on('tileloadend', function() {
//         document.querySelector('.spinner').style.display = 'none';
//         // document.querySelector('#map').classList.remove('hidden');
//     });
// });


document.addEventListener('DOMContentLoaded', function() {
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'https://{a-d}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    maxZoom: 19
                })
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([39.712567, 47.236597]), // Исходный центр
            zoom: 13,
            minZoom: 2
        })
    });

    var markerElement = document.createElement('div');
    markerElement.className = 'marker';
    markerElement.innerHTML = '';

    var markerOverlay = new ol.Overlay({
        element: markerElement,
        positioning: 'center-center',
        stopEvent: false
    });
    map.addOverlay(markerOverlay);

    map.on('click', function (e) {
        var coordinates = e.coordinate;
        markerOverlay.setPosition(coordinates);

        var lonLat = ol.proj.toLonLat(coordinates);
        var lon = lonLat[0].toFixed(6);
        var lat = lonLat[1].toFixed(6);

        console.log(lon);
        console.log(lat);

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`)
            .then(response => response.json())
            .then(data => {
                const address = data.address;
                const shortAddress = `${address.road || ''} ${address.house_number || ''}, ${address.city || ''}, ${address.country || ''}`;
                document.getElementById('login-address').value = shortAddress.trim();
            })
            .catch(err => {
                console.error('Ошибка при получении адреса:', err);
            });
    });

    map.getLayers().forEach(function(layer) {
        layer.getSource().on('tileloadend', function() {
            document.querySelector('.spinner').style.display = 'none';
        });
    });

    const input = document.getElementById('login-address');
    const suggestionsList = document.getElementById('suggestions');

    input.addEventListener('input', function() {
        const query = input.value;
        if (query.length > 2) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Полученные данные:', data);
                    if (data.length > 0) {
                        const suggestions = data.map(item => {
                            const fullAddress = item.display_name || '';
                            const addressParts = fullAddress.split(',').map(part => part.trim());
                
                            let street = '', house = '', city = '', country = '';
                            let streetFound = false;
                            let houseFound = false;
                            let cityFound = false;
                            let countryFound = false;
                
                            addressParts.forEach((part, index) => {
                                // Пропускаем почтовые индексы (если это 6 цифр)
                                if (/\d{6}/.test(part)) {
                                    return; // Если нашли почтовый индекс, пропускаем его
                                }
                
                                // Определение улицы и номера дома
                                if (!streetFound && (part.toLowerCase().includes('улица') || part.toLowerCase().includes('проспект') || part.toLowerCase().includes('переулок'))) {
                                    street = part;  // Улица
                                    streetFound = true;
                                } else if (!houseFound && /\d/.test(part)) {
                                    house = part;  // Номер дома
                                    houseFound = true;
                                }
                
                                // Определение города (смотрим назад на предыдущие элементы)
                                if (!cityFound && part.toLowerCase().includes('город') && index > 0) {
                                    city = addressParts[index - 1];  // Город из предыдущего элемента
                                    cityFound = true;
                                }
                
                                // Определение страны
                                if (!countryFound && part.toLowerCase().includes('россия')) {
                                    country = part;  // Страна
                                    countryFound = true;
                                }
                            });
                
                            // Формируем новый формат адреса (если есть улица, дом, город, страна)
                            const formattedAddress = [street, house, city, country].filter(Boolean).join(', ');
                
                            console.log('Formatted Address:', formattedAddress);
                            return formattedAddress;
                        });
                
                        suggestionsList.innerHTML = ''; // Очищаем список предложений
                        suggestions.forEach(address => {
                            const li = document.createElement('li');
                            li.textContent = address;
                
                            // Обработчик клика по предложению
                            li.onclick = () => {
                                input.value = address;  // Вставляем выбранный адрес в input
                                suggestionsList.innerHTML = ''; // Очищаем список

                                // Отправляем запрос к Nominatim API для получения координат выбранного адреса
                                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`)
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.length > 0) {
                                            const coordinates = [data[0].lon, data[0].lat];
                                            const lonLat = ol.proj.fromLonLat([parseFloat(coordinates[0]), parseFloat(coordinates[1])]);
                                            markerOverlay.setPosition(lonLat);
                                            map.getView().setCenter(lonLat);  // Центрируем карту на найденном адресе
                                            map.getView().setZoom(15);  // Устанавливаем zoom на более высокий уровень
                                        }
                                    })
                                    .catch(err => {
                                        console.error('Ошибка при получении координат:', err);
                                    });
                            };
                
                            // Добавляем элемент в список
                            suggestionsList.appendChild(li);
                        });
                    } else {
                        suggestionsList.innerHTML = '<li>Адрес не найден</li>';
                    }
                })
                .catch(error => {
                    console.error('Ошибка при получении данных: ', error);
                    suggestionsList.innerHTML = '<li>Ошибка при запросе</li>';
                });
        } else {
            suggestionsList.innerHTML = ''; // Очищаем список, если длина запроса меньше 3 символов
        }
    });
});


// document.addEventListener('DOMContentLoaded', function() {
//     var map = new ol.Map({
//         target: 'map',
//         layers: [
//             new ol.layer.Tile({
//                 source: new ol.source.XYZ({
//                     url: 'https://{a-d}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//                     maxZoom: 19
//                 })
//             })
//         ],
//         view: new ol.View({
//             center: ol.proj.fromLonLat([39.712567, 47.236597]),
//             zoom: 13,
//             minZoom: 2
//         })
//     });

//     var markerElement = document.createElement('div');
//     markerElement.className = 'marker';
//     markerElement.innerHTML = '';

//     var markerOverlay = new ol.Overlay({
//         element: markerElement,
//         positioning: 'center-center',
//         stopEvent: false
//     });
//     map.addOverlay(markerOverlay);

//     map.on('click', function (e) {
//         var coordinates = e.coordinate;
//         markerOverlay.setPosition(coordinates);

//         var lonLat = ol.proj.toLonLat(coordinates);
//         var lon = lonLat[0].toFixed(6);
//         var lat = lonLat[1].toFixed(6);

//         console.log(lon);
//         console.log(lat);

//         fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`)
//             .then(response => response.json())
//             .then(data => {
//                 const address = data.address;
//                 const shortAddress = `${address.road || ''} ${address.house_number || ''}, ${address.city || ''}, ${address.country || ''}`;
//                 document.getElementById('login-address').value = shortAddress.trim();
//             })
//             .catch(err => {
//                 console.error('Ошибка при получении адреса:', err);
//             });
//     });

//     map.getLayers().forEach(function(layer) {
//         layer.getSource().on('tileloadend', function() {
//             document.querySelector('.spinner').style.display = 'none';
//         });
//     });

//     const input = document.getElementById('login-address');
//     const suggestionsList = document.getElementById('suggestions');

//     input.addEventListener('input', function() {
//         const query = input.value;
//         if (query.length > 2) {
//             fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
//                 .then(response => response.json())
//                 .then(data => {
//                     console.log('Полученные данные:', data);
//                     if (data.length > 0) {
//                         const suggestions = data.map(item => {
//                             const fullAddress = item.display_name || '';
//                             const addressParts = fullAddress.split(',').map(part => part.trim());
                
//                             let street = '', house = '', city = '', country = '';
//                             let streetFound = false;
//                             let houseFound = false;
//                             let cityFound = false;
//                             let countryFound = false;
                
//                             addressParts.forEach((part, index) => {
//                                 // Пропускаем почтовые индексы (если это 6 цифр)
//                                 if (/\d{6}/.test(part)) {
//                                     return; // Если нашли почтовый индекс, пропускаем его
//                                 }
                
//                                 // Определение улицы и номера дома
//                                 if (!streetFound && (part.toLowerCase().includes('улица') || part.toLowerCase().includes('проспект') || part.toLowerCase().includes('переулок'))) {
//                                     street = part;  // Улица
//                                     streetFound = true;
//                                 } else if (!houseFound && /\d/.test(part)) {
//                                     house = part;  // Номер дома
//                                     houseFound = true;
//                                 }
                
//                                 // Определение города (смотрим назад на предыдущие элементы)
//                                 if (!cityFound && part.toLowerCase().includes('город') && index > 0) {
//                                     city = addressParts[index - 1];  // Город из предыдущего элемента
//                                     cityFound = true;
//                                 }
                
//                                 // Определение страны
//                                 if (!countryFound && part.toLowerCase().includes('россия')) {
//                                     country = part;  // Страна
//                                     countryFound = true;
//                                 }
//                             });
                
//                             // Формируем новый формат адреса (если есть улица, дом, город, страна)
//                             const formattedAddress = [street, house, city, country].filter(Boolean).join(', ');
                
//                             console.log('Formatted Address:', formattedAddress);
//                             return formattedAddress;
//                         });
                
//                         suggestionsList.innerHTML = ''; // Очищаем список предложений
//                         suggestions.forEach(address => {
//                             const li = document.createElement('li');
//                             li.textContent = address;
                
//                             // Обработчик клика по предложению
//                             li.onclick = () => {
//                                 input.value = address;  // Вставляем выбранный адрес в input
//                                 suggestionsList.innerHTML = ''; // Очищаем список
//                             };
                
//                             // Добавляем элемент в список
//                             suggestionsList.appendChild(li);
//                         });
//                     } else {
//                         suggestionsList.innerHTML = '<li>Адрес не найден</li>';
//                     }
//                 })
                
                
//                 .catch(error => {
//                     console.error('Ошибка при получении данных: ', error);
//                     suggestionsList.innerHTML = '<li>Ошибка при запросе</li>';
//                 });
//         } else {
//             suggestionsList.innerHTML = ''; // Очищаем список, если длина запроса меньше 3 символов
//         }
//     });
// });
