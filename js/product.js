function addToOrderList(product) {
    const orderList = document.querySelector('.order-list');
    const orderInfoContent = document.querySelector('.order-info-content');
    const productPrice = parseInt(product.price.replace(/,/g, ''));
    const orderListClone = orderList.cloneNode(true);

    // ***** 동일한 메뉴 클릭하면 수량 증가 시키기 *****
    const existingProduct = Array.from(orderInfoContent.children).find(menu => menu.querySelector('.product').innerText === product.name);

    if (existingProduct) {
        // # 수량 증가시키기
        const $number = existingProduct.querySelector('.number');
        let num = parseInt($number.textContent) + 1;
        $number.textContent = num;

        const price = existingProduct.querySelector('.price');
        const currentPrice = parseInt(price.textContent.replace(/,/g, ''));
        const newPrice = currentPrice + productPrice;
        price.textContent = newPrice.toLocaleString() + '원';

        updateTtlAmount(1);
        updateTtlPrice(productPrice);
    } else {
        // 새로운 메뉴 추가
        orderListClone.style.display = 'block';
        orderListClone.style.display = 'flex';
        orderListClone.querySelector('.order-list .product').innerText = product.name;
        orderListClone.querySelector('.order-list .price').innerText = product.price + '원';


        // ***** order-list X버튼 누르면 해당 목록 사라지게 하기 ***** 
        const $cancel = orderListClone.querySelector('.cancel');
        
        $cancel.addEventListener('click', () => {
            orderListClone.remove();
            updateTtlAmount(-num);  // 총 수량 해당 목록 수량만큼 감소
            updateTtlPrice(-productPrice * num);  // 총 금액 해당 목록 금액만큼 감소
        });
        
        const number = orderListClone.querySelector('.number');
        let num = 1;

        // # -버튼 누르면 감소하기
        const minusBtn = orderListClone.querySelector('.minus-btn');
        minusBtn.addEventListener('click', () => {
            if (num > 1) {
                num--;
                number.textContent = num;
                updateTtlPrice(-productPrice);
                ttlProductPrice();
                updateTtlAmount(-1);
            } else {
                orderListClone.remove();
                updateTtlAmount(-num);
                updateTtlPrice(-productPrice * num);
            }
        });

        // # +버튼 누르면 증가하기
        const plusBtn = orderListClone.querySelector('.plus-btn');
        plusBtn.addEventListener('click', () => {
            num++;
            number.textContent = num;
            const currentPrice = parseInt(orderListClone.querySelector('.price').textContent.replace(/,/g, ''));
            const newPrice = currentPrice + productPrice;
            orderListClone.querySelector('.price').textContent = newPrice.toLocaleString() + '원';
            updateTtlAmount(1);
            updateTtlPrice(productPrice);
        });

        // # 메뉴 가격 계산하는 함수
        function ttlProductPrice() {
            const totalPrice = num * productPrice;
            orderListClone.querySelector('.price').textContent = totalPrice.toLocaleString() + '원';
        }
        
        // # 총 수량/금액 첫 번째 값
        updateTtlAmount(1);
        updateTtlPrice(productPrice);

        orderInfoContent.appendChild(orderListClone);
    }

    // ***** 취소 버튼 누르면 초기화 *****
    const cancelBtn = document.querySelector('.btn-box .cancel-btn');
    cancelBtn.addEventListener('click', () => {
        resetTtl();
        orderListClone.remove();
    });
}
