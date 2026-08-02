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
        document.querySelectorAll(".copy-box");


    let copyMessageTimeout;


    async function copyText(text) {

        if (navigator.clipboard && window.isSecureContext) {

            await navigator.clipboard.writeText(text);
            return;

        }


        const tempInput =
            document.createElement("textarea");

        tempInput.value = text;
        tempInput.setAttribute("readonly", "");
        tempInput.style.position = "absolute";
        tempInput.style.left = "-9999px";

        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

    }


    copyTargets.forEach(target => {

        target.addEventListener("click", async () => {

            try {

                await copyText(target.textContent.trim());

                if (copyMessage) {

                    copyMessage.classList.remove("show");
                    void copyMessage.offsetWidth;
                    copyMessage.classList.add("show");

                    clearTimeout(copyMessageTimeout);
                    copyMessageTimeout = setTimeout(() => {

                        copyMessage.classList.remove("show");

                    }, 3000);

                }

            } catch (error) {

                console.error("Copy failed:", error);

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


    const close =
    document.querySelector("#rsvpModal .close");



    if (openRSVP) {

        openRSVP.onclick = () => {

            modal.classList.add("active");

        };

    }



    if (close) {

        close.onclick = () => {

            modal.classList.remove("active");

        };

    }



    if (modal) {

        modal.onclick = (e) => {

            if (e.target === modal) {

                modal.classList.remove("active");

            }

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


            } else {


                answer.innerHTML = `

<h3>
Λάβαμε την απάντησή σας.
</h3>

<p>
Θα μας λείψετε.
</p>

`;


            }



            answer.classList.add("show");



            setTimeout(() => {


                modal.classList.remove("active");


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