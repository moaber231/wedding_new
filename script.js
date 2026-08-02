document.addEventListener("DOMContentLoaded", () => {



    /* =====================================
    GOOGLE SHEET CONNECTION
    ===================================== */


    const GOOGLE_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbwO-icwrbunRo_QrxBhkOrq1VoOo9p7b-ZiJdcN4FTEs9CYemNpK1LlSlRSqTWJ-GRr/exec";



    /* =====================================
    SCROLL REVEAL
    ===================================== */


    const revealElements =
        document.querySelectorAll(".reveal");



    const revealObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(entry => {


                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");
                        entry.target.classList.add("active");
                        if (entry.target.classList.contains("koumparoi")) {

                            entry.target.querySelector(".stefana-icon img")
                                ?.classList.add("show");

                        }

                    }


                });


            }, {
                threshold: 0.15
            }
        );



    revealElements.forEach(element => {

        revealObserver.observe(element);

    });




    /* =====================================
    COUNTDOWN
    ===================================== */


    const weddingDate =
        new Date(
            "November 7, 2026 18:00:00"
        ).getTime();



    function updateCountdown() {


        const now =
            new Date().getTime();


        const distance =
            weddingDate - now;



        if (distance <= 0) return;




        document.getElementById("days").textContent =
            String(
                Math.floor(distance / (1000 * 60 * 60 * 24))
            )
            .padStart(2, "0");



        document.getElementById("hours").textContent =
            String(
                Math.floor(distance / (1000 * 60 * 60) % 24)
            )
            .padStart(2, "0");



        document.getElementById("minutes").textContent =
            String(
                Math.floor(distance / (1000 * 60) % 60)
            )
            .padStart(2, "0");



        document.getElementById("seconds").textContent =
            String(
                Math.floor(distance / 1000 % 60)
            )
            .padStart(2, "0");

    }


    setInterval(updateCountdown, 1000);

    updateCountdown();




    const copyMessage =
        document.querySelector(".copy-message");


    const copyTargets =
        document.querySelectorAll("#iban, #phone");


    let copyMessageTimer = null;


    function showCopyMessage() {


        if (!copyMessage) return;


        copyMessage.classList.remove("show", "hide");

        void copyMessage.offsetWidth;
        copyMessage.classList.add("show");


        if (copyMessageTimer) {

            clearTimeout(copyMessageTimer);

        }


        copyMessageTimer = setTimeout(() => {

            copyMessage.classList.add("hide");

        }, 3000);

    }


    function copyToClipboard(text) {


        if (navigator.clipboard?.writeText) {

            return navigator.clipboard.writeText(text);

        }


        const tempInput = document.createElement("input");

        tempInput.value = text;

        tempInput.style.position = "fixed";

        tempInput.style.opacity = "0";

        document.body.appendChild(tempInput);

        tempInput.select();

        document.execCommand("copy");

        document.body.removeChild(tempInput);

        return Promise.resolve();

    }


    copyTargets.forEach(target => {

        target.addEventListener("click", async () => {

            const text = target.textContent.trim();

            try {

                await copyToClipboard(text);

                showCopyMessage();

            } catch (error) {

                console.error("COPY ERROR:", error);

            }

        });

    });




    /* =====================================
    RSVP MODAL
    ===================================== */


    const modal =
        document.getElementById("rsvpModal");


    const openRSVP =
        document.getElementById("openRSVP");


    const rsvpIntroStep =
        document.getElementById("rsvpIntroStep");


    const rsvpAttendStep =
        document.getElementById("rsvpAttendStep");


    const showAttendanceFields =
        document.getElementById("showAttendanceFields");


    const showDeclineHeart =
        document.getElementById("showDeclineHeart");


    const declineHeart =
        document.getElementById("declineHeart");


    const close =
    document.querySelector("#rsvpModal .close");


    function resetRsvpModal() {

        modal.classList.remove("step-attend", "step-decline");
        modal.classList.remove("step-success");
        rsvpIntroStep?.classList.add("active");
        rsvpAttendStep?.classList.remove("active");
        declineHeart?.classList.remove("show");
        answer?.classList.remove("show");
        answer.innerHTML = "";

    }



    if (openRSVP) {

        openRSVP.onclick = () => {

            modal.classList.add("active");
            resetRsvpModal();

        };

    }



    if (close) {

        close.onclick = () => {

            modal.classList.remove("active");
            resetRsvpModal();

        };

    }



    if (modal) {

        modal.onclick = (e) => {

            if (e.target === modal) {

                modal.classList.remove("active");
                resetRsvpModal();

            }

        };

    }


    if (showAttendanceFields) {

        showAttendanceFields.onclick = () => {

            modal.classList.add("step-attend");
            modal.classList.remove("step-decline");
            rsvpIntroStep?.classList.remove("active");
            rsvpAttendStep?.classList.add("active");
            declineHeart?.classList.remove("show");

        };

    }


    if (showDeclineHeart) {

        showDeclineHeart.onclick = () => {

            modal.classList.add("step-decline");
            modal.classList.remove("step-attend");
            rsvpIntroStep?.classList.remove("active");
            rsvpAttendStep?.classList.remove("active");
            declineHeart?.classList.add("show");
            answer?.classList.remove("show");
            answer.innerHTML = "";

            setTimeout(() => {

                declineHeart?.classList.remove("show");
                modal.classList.remove("active");
                resetRsvpModal();

            }, 2800);

        };

    }




    /* =====================================
    SEND RSVP TO GOOGLE SHEET
    ===================================== */


    const nameInput =
        document.getElementById("guestName");


    const adultsInput =
        document.getElementById("adults");


    const childrenInput =
        document.getElementById("children");


    const answer =
        document.querySelector(".answer");




    async function sendRSVP(status) {


        const data = {

            name: nameInput.value.trim(),

            adults: adultsInput.value,

            children: childrenInput.value,

            status: status

        };



        console.log("Sending RSVP:");
        console.log(data);



        try {


            const response = await fetch(
                GOOGLE_SCRIPT_URL, {

                    method: "POST",

                    mode: "no-cors",

                    headers: {

                        "Content-Type": "application/x-www-form-urlencoded"

                    },

                    body: new URLSearchParams(data).toString()


                });



            console.log(
                "RSVP SENT"
            );



            if (status === "Coming") {


                answer.innerHTML = `

<h3>
Σας περιμένουμε!
</h3>

<p>
Χαιρόμαστε που θα είστε μαζί μας.
</p>

`;


                modal.classList.remove("step-attend");
                modal.classList.add("step-success");


            } else {


                answer.innerHTML = `

<h3>
Λάβαμε την απάντησή σας.
</h3>

<p>
Θα μας λείψετε.
</p>

`;


                modal.classList.add("step-decline");


            }



            answer.classList.add("show");



            setTimeout(() => {


                modal.classList.remove("active");


                modal.classList.remove("step-success", "step-decline", "step-attend");


                answer.classList.remove("show");


                answer.innerHTML = "";


            }, 2500);



        } catch (error) {


            console.error(
                "RSVP ERROR:",
                error
            );



            answer.innerHTML =

                `
<p>
Υπήρξε πρόβλημα.
Παρακαλώ δοκιμάστε ξανά.
</p>
`;



        }



    }




    const attend =
        document.getElementById("attend");


    if (attend) {

        attend.onclick = () => {

            sendRSVP("Coming");

        };

    }



    const decline =
        document.getElementById("decline");


    if (decline) {

        decline.onclick = () => {

            sendRSVP("Not Coming");

        };

    }




    /* =====================================
    PHOTO UPLOAD
    ===================================== */


    const fileInput =
        document.getElementById("fileInput");


    const dropZone =
        document.getElementById("dropZone");


    const preview =
        document.getElementById("preview");




    function showImages(files) {



        Array.from(files).forEach(file => {


            if (!file.type.startsWith("image"))
                return;



            const reader =
                new FileReader();



            reader.onload = (e) => {


                const img =
                    document.createElement("img");


                img.src = e.target.result;


                preview.appendChild(img);


            };



            reader.readAsDataURL(file);



        });



    }




    if (dropZone) {



        dropZone.onclick = () => {

            fileInput.click();

        };



        fileInput.onchange = (e) => {

            showImages(e.target.files);

        };



        dropZone.ondragover = (e) => {

            e.preventDefault();

        };



        dropZone.ondrop = (e) => {


            e.preventDefault();


            showImages(
                e.dataTransfer.files
            );


        };



    }
    document.querySelectorAll(".person img").forEach(img => {

        img.addEventListener("click", () => {

            img.classList.toggle("colored");

        });

    });


});