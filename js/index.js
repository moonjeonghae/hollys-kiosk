window.onload = function() {
    const logo = document.querySelector('.logo img');

    logo.addEventListener('click', () => window.location.href = 'index.html');

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


    axios.get('./data/product.json')
    .then(result => {
        const menuData = result.data;
        console.log(menuData);
        const mainMenuLinks = document.querySelectorAll('.gnb a');
        const subTitleList = document.querySelector('.sub-title ul');
        const menuContentBox = document.getElementById('menu-content-box');
        const menuList = document.getElementById('menu-list');

        mainMenuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const type = this.getAttribute('data-type');
                showSubMenu(type); 
            });
        });

        function showSubMenu(type) {
            const subMenuTypes = Object.keys(menuData[type]);
            console.log(subMenuTypes);
            
            subTitleList.innerHTML = '';

            subMenuTypes.forEach((typeName, idx) => {
                const li = document.createElement('li');
                li.textContent = typeName;

                li.id = `sub-title-${idx + 1}`;
                subTitleList.appendChild(li);

                li.addEventListener('click', function() {
                    const initialSelected = subTitleList.querySelector('.selected');

                    if(initialSelected) {
                        initialSelected.classList.remove('selected');
                    }

                    this.classList.add('selected');
                    console.log('Clicked: ' + typeName);
                    console.log(menuProducts);
                    displayProducts(menuProducts);
                });
                
                const menuProducts = menuData[type][typeName];
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
                    addToOrderList(product); 
                });  
            });

            function addToOrderList(product) {
                const orderInfoContent = document.querySelector('.order-info-content');
                const orderList = document.querySelector('.order-list');
                const orderListClone = orderList.cloneNode(true);
                const productPrice = parseInt(product.price.replace(/,/g, ''));
                
                let existingOrder = Array.from(orderInfoContent.children).find(
                    order => order.querySelector('.product').textContent === product.name
                );
            
                if (existingOrder) {
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
                    orderListClone.querySelector('.number').textContent = 1;
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

                const cancelBtn = document.querySelector('.btn-box .cancel-btn');

                cancelBtn.addEventListener('click', () => {
                    resetTtl();
                    orderListClone.remove();
                });

                updateFinalOrderChk();
            }
        }
        
        const ttlAmount = document.querySelector('.ttl-amount');
        let ttlNum = 0;
        
        function updateTtlAmount(change) {
            ttlNum += change;
            ttlAmount.textContent = ttlNum + '개';
        }

        const totalPrice = document.querySelector('.ttl-price');
        let ttlPrice = 0;

        function updateTtlPrice(change) {
            ttlPrice += change;
            totalPrice.textContent = ttlPrice.toLocaleString() + '원'; 
        }
        
        function resetTtl() {
            ttlNum = 0;
            ttlPrice = 0;
            ttlAmount.textContent = ttlNum + '개';
            totalPrice.textContent = ttlPrice + '원';
        }

        showSubMenu('coffee');
    })
    .catch(error => {
        console.log('통신 에러 : ' + error);
    });


    const orderBtn = document.querySelector('.order-btn');
    const modal = document.querySelector('.order-modal');
    const backBtns = document.querySelectorAll('.back');

    orderBtn.addEventListener('click', () => {
        const orderInfoContent = document.querySelector('.order-info-content');

        if (orderInfoContent.children.length === 1) {
            alert('제품을 선택하세요');
        } else {
            modal.style.display = 'block';
            updateFinalOrderChk();
        }
    });

    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
            calcModal.style.display = 'none';
            resetFinalPrice();
        });
    });

    const orderMethodBtns = document.querySelectorAll('.modal-btn button');
    const calcModal = document.querySelector('.calc');

    orderMethodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            calcModal.style.display = 'grid';
        });
    });

    function updateFinalOrderChk() {
        const finalOrderChk = document.querySelector('.final-order-check');
        const orderlists = document.querySelectorAll('.order-info-content .order-list');
        finalOrderChk.innerHTML = '';

        orderlists.forEach((list, idx) => {
            if (idx === 0) return;

            if(list.style.display !== 'none') {
                const finalOrderListDiv = document.createElement('div');
                finalOrderListDiv.className = 'final-order-list';
    
                const productName = list.querySelector('.product').textContent;
                const productAmount = list.querySelector('.number').textContent;
                const productPrice = list.querySelector('.price').textContent;
    
                finalOrderListDiv.innerHTML = `
                    <div class="product">${productName}</div>
                    <div class="amount">${productAmount}</div>
                    <div class="price">${productPrice}</div>
                `;

                finalOrderChk.appendChild(finalOrderListDiv);
            }
        });

        updateFinalPrice();

    }

    const totalPrice = document.querySelector('.ttl-price');
    const payPrice = document.querySelector('.pay-price');

    function updateFinalPrice() {
        const finalTotalPrice = document.querySelector('.total-price');
        const totalPrice = document.querySelector('.ttl-price');

        finalTotalPrice.innerText = totalPrice.innerText;
    }
    
    let currentPayPrice = 0;

    function updatePayPrice() {
        const buttons = document.querySelectorAll('.pay-method-btn button');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const addToPrice = parseInt(btn.getAttribute('data-price').replace(',', ''));
                currentPayPrice += addToPrice;
                
                payPrice.textContent = currentPayPrice.toLocaleString() + '원';
            });
        });
    }

    updatePayPrice();

    function resetFinalPrice() {
        currentPayPrice = 0;
        payPrice.textContent = '0원';
        changeMoney.textContent = '0원';
    }

    const resetMethodBtn = document.querySelector('.method-reset button');
        
        resetMethodBtn.addEventListener('click', () => {
            resetFinalPrice();
        });

    const payBtn = document.querySelector('.pay-btn button');
    const changeMoney = document.querySelector('.change-money');
    
    payBtn.addEventListener('click', () => {
        changeCalc();
    });

    function changeCalc() {
        const ttl = parseInt(totalPrice.textContent.replace('원', '').replace(',', ''));
        const pay = currentPayPrice;

        const change = pay -ttl;
        changeMoney.textContent = change.toLocaleString() + '원'; 
        
        if(ttl > pay) {
            const shortage = Math.abs(change).toLocaleString() + '원';
            alert(`금액이 부족합니다.\n\n부족한 금액 : ${shortage}`);
            resetFinalPrice();
        } else {
            setTimeout(() => {
                let lastQuestion = confirm('결제하시겠습니까?');

                if(lastQuestion) {
                    alert('결제가 완료되었습니다.');
                    window.location.href = 'index.html';
                }
            });
        }
    }
 }