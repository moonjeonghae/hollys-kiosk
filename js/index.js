window.onload = function() {
    // ***** gnb 클릭 시 해당 텍스트로 타이틀 변경 *****
    const mainMenuTitles = document.querySelectorAll('.gnb a');
    const $title = document.querySelector('.kiosk-content > .title');

    mainMenuTitles.forEach(title => {
        title.addEventListener('click', function(e) {
            e.preventDefault();

            $title.textContent = this.textContent;

            mainMenuTitles.forEach(title => {
                title.classList.remove('active');
            });

            this.classList.add('active');
        });
    });

    function initialTitle() {
        mainMenuTitles.forEach(title => {
            if(title.dataset.type.toLowerCase() === 'coffee') {
                title.classList.add('active');
                $title.textContent = title.textContent;
            } else {
                title.classList.remove('active');
            }
        });
    }

    initialTitle();




    axios.get('./data/test.json')
    .then(result => {
        const menuData = result.data;
        console.log(menuData);
        const mainMenuLinks = document.querySelectorAll('.gnb a');
        const subTitleList = document.querySelector('.sub-title ul');
        const menuContentBox = document.getElementById('menu-content-box');
        const menuList = document.getElementById('menu-list');

        // 메뉴 클릭 시 해당 서브메뉴 보이기
        mainMenuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const type = this.getAttribute('data-type');
                showSubMenu(type);  // 링크 클릭 시 해당 서브메뉴 보이기
            });
        });

        // 서브메뉴 보여주기
        function showSubMenu(type) {
            const subMenuTypes = Object.keys(menuData[type]);
            console.log(subMenuTypes);
            
            // 서브메뉴 리스트 초기화
            subTitleList.innerHTML = '';

            subMenuTypes.forEach((typeName, idx) => {
                const li = document.createElement('li');
                li.textContent = typeName;

                li.id = `sub-title-${idx + 1}`;
                subTitleList.appendChild(li);

                li.addEventListener('click', function() {
                    // # selected 적용/해지
                    const initialSelected = subTitleList.querySelector('.selected');

                    if(initialSelected) {
                        initialSelected.classList.remove('selected');
                    }

                    this.classList.add('selected');
                    // # 클릭 시 어떤 거 클릭 했는지 확인
                    console.log('Clicked: ' + typeName);

                    // # type에서 typeName에 해당하는 데이터를 보이게 하기
                    console.log(menuProducts);
                    displayProducts(menuProducts);
                });
                
                const menuProducts = menuData[type][typeName];

                // # 첫 번째 서브타이틀에 css 적용
                if (idx === 0) {
                    li.classList.add('selected');
                    displayProducts(menuProducts);
                  }
            });
        }

        function displayProducts(menuProducts) {
            menuContentBox.innerHTML = '';

            menuProducts.forEach(product => {
                const menuListClone = menuList.cloneNode(true);
                menuListClone.style.display = 'block';
                const productImage = menuListClone.querySelector('.product-image');
                productImage.src = `./images/${product.img}`;
                productImage.alt = product.name;
                menuListClone.querySelector('.product-name').innerText = product.name;
                menuListClone.querySelector('.product-price').innerText = product.price + '원';

                menuContentBox.appendChild(menuListClone);
            });
        }
        // 초기 값 : coffee로 설정
        showSubMenu('coffee');
    })
    .catch(error => {
        console.log('통신 에러 : ' + error);
    });
 }