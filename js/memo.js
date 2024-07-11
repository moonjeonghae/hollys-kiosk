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
