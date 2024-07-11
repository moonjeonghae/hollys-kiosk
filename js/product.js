window.onload = function() {
    const menuContentBox = document.querySelector('.menu-content-box');
    const menuList = document.querySelector('.menu-list');
    const subTitle1 = document.getElementById('sub-title-1');
    const subTitle2 = document.getElementById('sub-title-2');    
    let products = [];

    axios.get('./data/product.json')
        .then (result => {
            console.log('통신결과: ', result.data);
            console.log(result.data[0].name);
            products = result.data;

            subTitle1.addEventListener('click', () => displayProducts('에스프레소'));
            subTitle2.addEventListener('click', () => displayProducts('디카페인'));
            
            displayProducts('에스프레소');
        })   
        .catch(error => {
            console.log('에러 발생 : ', error);
        });

        function displayProducts(type) {
            menuContentBox.innerHTML = '';

            const filterProducts = products.filter(product => product.type === type);

            filterProducts.forEach(product => {
                const menuListClone = menuList.cloneNode(true);
                menuListClone.style.display = 'block';
                const productImage = menuListClone.querySelector('.product-image');
                productImage.src = `./images/coffee/${product.img}`;
                productImage.alt = product.name;
                menuListClone.querySelector('.product-name').innerText = product.name;
                menuListClone.querySelector('.en-product-name').innerText = product.englishName;
                menuListClone.querySelector('.product-price').innerText = product.price;

                menuContentBox.appendChild(menuListClone);
            });
        }
        
}