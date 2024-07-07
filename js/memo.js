axios.get('./data/subMenu.json')
    .then(result => {
        const subMenuData = result.data;
        const mainMenuLinks = document.querySelectorAll('.gnb a');
        console.log(subMenuData);


        mainMenuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const type = this.getAttribute('data-type');
                showSubMenu(type);  // link 클릭 시 해당 서브메뉴 보이게 하기
            });
        });

        function showSubMenu(type) {
            const subMenuItems = subMenuData[type] || [];
            const subMenuList = document.querySelector('.sub-title ul');

            // 서브메뉴 리스트 초기화
            subMenuList.innerHTML = ''; 

            subMenuItems.forEach((item, idx) => {
                const li = document.createElement('li');
                li.textContent = item;
                subMenuList.appendChild(li);

                // 초기 값 : 첫 번째 서브메뉴 li에 selected 적용
                if (idx === 0) {
                    li.classList.add('selected');
                }

                li.addEventListener('click', function() {
                    const subMenuElements = subMenuList.querySelectorAll('li');

                    // 기존 selected 클래스 제거
                    subMenuElements.forEach(el => {
                        el.classList.remove('selected');
                    });

                    // 현재 클릭된 li에 selected 클래스 추가
                    this.classList.add('selected');
                });

            });
        }

        // 초기 값 : coffee로 설정
        showSubMenu('coffee');
    })
    .catch(error => {
        console.log('통신 에러 : ' + error);
    });
