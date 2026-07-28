document.addEventListener("DOMContentLoaded", function(){

    const envelope = document.querySelector(".envelope");
    const letter = document.querySelector('.letter');
    const rsvpSection = document.querySelector('.rsvp-section');
    const noButton = document.querySelector('.rsvp-option.no');
    const yesButton = document.querySelector('.rsvp-option.yes');
    const successOverlay = document.querySelector('.rsvp-success-overlay');
    const successClose = document.querySelector('.celebration-close');

    if(envelope){
        envelope.onclick = function(){
            envelope.classList.toggle("open");
        };
    }

    function createConfetti(){
        if(!successOverlay) return;
        const colors = ['#a855f7', '#fb7185', '#7c3aed', '#f59e0b', '#22d3ee'];
        for(let i = 0; i < 20; i++){
            const piece = document.createElement('span');
            piece.className = 'confetti-piece';
            const size = Math.random() * 8 + 6;
            const left = Math.random() * 80 + 10;
            const delay = Math.random() * 0.4;
            piece.style.left = `${left}%`;
            piece.style.width = `${size}px`;
            piece.style.height = `${size}px`;
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = `${delay}s`;
            piece.style.borderRadius = Math.random() > 0.5 ? '3px' : '50%';
            successOverlay.appendChild(piece);
            piece.addEventListener('animationend', () => piece.remove());
        }
    }

    function openSuccess(){
        if(!successOverlay) return;
        successOverlay.classList.add('active');
        successOverlay.setAttribute('aria-hidden', 'false');
        createConfetti();
    }

    function closeSuccess(){
        if(!successOverlay) return;
        successOverlay.classList.remove('active');
        successOverlay.setAttribute('aria-hidden', 'true');
    }

    if(yesButton){
        yesButton.addEventListener('click', function(event){
            event.stopPropagation();
            openSuccess();
        });
    }

    if(successClose){
        successClose.addEventListener('click', function(){
            closeSuccess();
        });
    }

    if(letter && rsvpSection && noButton){
        let currentX = 0;
        let currentY = 0;
        const buttonRect = noButton.getBoundingClientRect();
        const buttonWidth = buttonRect.width;
        const buttonHeight = buttonRect.height;

        function clamp(value, min, max){
            return Math.min(Math.max(value, min), max);
        }

        function moveNo(x, y){
            const letterRect = letter.getBoundingClientRect();
            const minX = 12;
            const maxX = letterRect.width - buttonWidth - 24;
            const minY = 12;
            const maxY = letterRect.height - buttonHeight - 24;
            currentX = clamp(x, minX, maxX);
            currentY = clamp(y, minY, maxY);
            noButton.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }

        function moveAwayFrom(pointX, pointY){
            const btnRect = noButton.getBoundingClientRect();
            const centerX = btnRect.left + btnRect.width / 2;
            const centerY = btnRect.top + btnRect.height / 2;
            const dx = centerX - pointX;
            const dy = centerY - pointY;
            const distance = Math.max(Math.hypot(dx, dy), 1);
            const speed = 120;
            const targetX = currentX + (dx / distance) * speed;
            const targetY = currentY + (dy / distance) * speed;
            moveNo(targetX, targetY);
        }

        rsvpSection.addEventListener('mousemove', function(event){
            if(!envelope.classList.contains('open')) return;
            moveAwayFrom(event.clientX, event.clientY);
        });

        noButton.addEventListener('touchstart', function(event){
            if(!envelope.classList.contains('open')) return;
            event.preventDefault();
            const letterRect = letter.getBoundingClientRect();
            const safeWidth = letterRect.width - buttonWidth - 24;
            const safeHeight = letterRect.height - buttonHeight - 24;
            const randomX = Math.round(Math.random() * safeWidth);
            const randomY = Math.round(Math.random() * safeHeight);
            moveNo(randomX, randomY);
        }, { passive: false });
    }

});