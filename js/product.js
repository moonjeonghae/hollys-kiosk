// axios.get('./data/product.json')
//         .then (result => {
//             console.log('통신결과: ', result.data);
//             console.log(result.data[0].name);
//             const products = result.data;

//             // 메뉴 타입에 따라 분류
//             const groupedByType = {};
//             products.forEach(product => {
//                 if (!groupedByType[product.type]) {
//                     groupedByType[product.type] = [];
//                 }
//                 groupedByType[product.type].push(product);
//             });


//             const menuContentBox = document.querySelector('.menu-content-box');
//             const menuList = document.querySelector('.menu-list');
            
//             result.data.forEach((product) => {
//                 const menuListClone = menuList.cloneNode(true);
//                 menuListClone.style.display = 'block';
//                 const productImage = menuListClone.querySelector('.product-image');
//                 productImage.src = `./images/coffee/${product.img}`;
//                 productImage.alt = product.name;
//                 menuListClone.querySelector('.product-name').innerText = product.name;
//                 menuListClone.querySelector('.en-product-name').innerText = product.englishName;
//                 menuListClone.querySelector('.product-price').innerText = product.price;

//                 menuContentBox.appendChild(menuListClone);
//             });
//         })  
//         .catch(error => {
//             console.log('에러 발생 : ', error);
//         });
