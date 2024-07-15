window.onload = function() {
    // ***** logo 클릭 시 화면 초기화 *****
    const logo = document.querySelector('.logo img');

    logo.addEventListener('click', () => window.location.href = 'index.html');

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



    // ***** subtitle & 해당 메뉴 *****
    axios.get('./data/product.json')
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

                menuListClone.addEventListener('click', () => {
                    addToOrderList(product);  // 선택 목록 추가 함수 호출
                });  
            });

            // ***** 메뉴 클릭 시 선택 목록에 나타나게 하기 ***** 
            function addToOrderList(product) {
                const orderInfoContent = document.querySelector('.order-info-content');
                const orderList = document.querySelector('.order-list');
                const orderListClone = orderList.cloneNode(true);
                const productPrice = parseInt(product.price.replace(/,/g, ''));
                
                // # 이미 존재하는 주문인지 확인
                let existingOrder = Array.from(orderInfoContent.children).find(
                    order => order.querySelector('.product').textContent === product.name
                );
            
                if (existingOrder) {
                    // # 이미 존재하는 주문이면 수량만 증가
                    const number = existingOrder.querySelector('.number');
                    let num = parseInt(number.textContent);
                    num++;
                    number.textContent = num;
                    updateTtlAmount(1);
                    updateTtlPrice(productPrice);
                    ttlProductPrice(existingOrder, num, productPrice);
                } else {
                    
                    orderListClone.style.display = 'block';
                    orderListClone.style.display = 'flex';
                    orderListClone.querySelector('.product').textContent = product.name;
                    orderListClone.querySelector('.price').textContent = product.price + '원';
            
                    const $cancel = orderListClone.querySelector('.cancel');
                    const number = orderListClone.querySelector('.number');
            
                    $cancel.addEventListener('click', () => {
                        const currentNum = parseInt(number.textContent);
                        orderListClone.remove();
                        updateTtlAmount(-currentNum);
                        updateTtlPrice(-productPrice * currentNum);
                    });
            
                    updateTtlAmount(1);
                    updateTtlPrice(productPrice);
            
                    orderInfoContent.appendChild(orderListClone);
                    existingOrder = orderListClone;
                }
            
                // ***** 메뉴 가격 계산 함수 ***** 
                function ttlProductPrice(orderElement, num, productPrice) {
                    const totalPrice = num * productPrice;
                    orderElement.querySelector('.price').textContent = totalPrice.toLocaleString() + '원';
                }
            
                const plusBtn = existingOrder.querySelector('.plus-btn');
                const minusBtn = existingOrder.querySelector('.minus-btn');
                const number = existingOrder.querySelector('.number');
                let num = parseInt(number.textContent);
            
                plusBtn.onclick = () => {
                    num++;
                    number.textContent = num;
                    updateTtlAmount(1);
                    updateTtlPrice(productPrice);
                    ttlProductPrice(existingOrder, num, productPrice);
                };
            
                minusBtn.onclick = () => {
                    if (num > 1) {
                        num--;
                        number.textContent = num;
                        updateTtlPrice(-productPrice);
                        ttlProductPrice(existingOrder, num, productPrice);
                        updateTtlAmount(-1);
                    } else {
                        existingOrder.remove();
                        updateTtlAmount(-num);
                        updateTtlPrice(-productPrice * num);
                    }
                };

                // ***** 취소 버튼 누르면 초기화 *****
                const cancelBtn = document.querySelector('.btn-box .cancel-btn');

                cancelBtn.addEventListener('click', () => {
                    resetTtl();
                    orderListClone.remove();
                });
            }
        }
        

        // ***** 총 수량 증가/감소 함수 ***** 
        const ttlAmount = document.querySelector('.ttl-amount');
        let ttlNum = 0;
        
        function updateTtlAmount(change) {
            ttlNum += change;
            ttlAmount.textContent = ttlNum + '개';
        }

        // ***** 총 금액 증가/감소 함수 ***** 
        const totalPrice = document.querySelector('.ttl-price');
        let ttlPrice = 0;

        function updateTtlPrice(change) {
            ttlPrice += change;
            totalPrice.textContent = ttlPrice.toLocaleString() + '원';  // toLocaleString() => 천 단위에 , 삽입하여 입력
        }
        
        // ***** 취소 버튼 누르면 총 수량/금액 초기화 함수 *****
        function resetTtl() {
            ttlNum = 0;
            ttlPrice = 0;
            ttlAmount.textContent = ttlNum + '개';
            totalPrice.textContent = ttlPrice + '원';
        }

        // 초기 값 : coffee로 설정
        showSubMenu('coffee');
    })
    .catch(error => {
        console.log('통신 에러 : ' + error);
    });


    // ***** 주문하기 버튼 누르면 모달창 띄우기 & 뒤로가기 버튼 실행 *****
    const orderBtn = document.querySelector('.order-btn');
    const modal = document.querySelector('.order-modal');
    const backBtn = document.querySelector('.back');

    orderBtn.addEventListener('click', () => {
        // const orderList = document.querySelector('.order-list');
        const orderInfoContent = document.querySelector('.order-info-content');

        if (orderInfoContent.children.length === 1) {  // 안 보이는 템플릿이 있기 때문에 length 1
            alert('제품을 선택하세요');
        } else {
            modal.style.display = 'block';
        }
    });
    backBtn.addEventListener('click', () => modal.style.display = 'none');
 }