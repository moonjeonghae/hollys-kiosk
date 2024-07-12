 // # -버튼 누르면 감소하기
 const minusBtn = orderListClone.querySelector('.minus-btn');
 minusBtn.addEventListener('click', (e) => {
     e.stopPropagation();

     if(num > 1) {
         num--;
         number.textContent = num;
     } else {
         orderListClone.remove();
     }
     // # 총 금액 감소
     updateTtlPrice(-productPrice);
     ttlProductPrice();
      // # 총 수량 감소
      updateTtlAmount(-1);
 });

 // # +버튼 누르면 증가하기
 const plusBtn = orderListClone.querySelector('.plus-btn');
 plusBtn.addEventListener('click', (e) => {
     e.stopPropagation();
     num++;
     number.textContent = num;

     // # 총 수량도 증가
     updateTtlAmount(1);

     // # 총 금액 증가
     updateTtlPrice(productPrice);
     ttlProductPrice();
 });

 function plusBtnHandling(e) {
    e.stopPropagation();
    num++;
    number.textContent = num;

    // # 총 수량도 증가
    updateTtlAmount(1);

    // # 총 금액 증가
    updateTtlPrice(productPrice);
    ttlProductPrice();
 }

 function minusBtnHandling(e) {
    e.stopPropagation();
    if(num > 1) {
        num--;
        number.textContent = num;
    } else {
        orderListClone.remove();
    }
    // # 총 금액 감소
    updateTtlPrice(-productPrice);
    ttlProductPrice();
     // # 총 수량 감소
     updateTtlAmount(-1);
 }