$(document).ready(async function () {
    let postedQuiz = null;

    $('#quiz-file').change(function (e) {
        var file = e.target.files[0];
        var reader = new FileReader();

        reader.onload = function (e) {
            const contents = e.target.result;
            console.log(contents);

            const lines = contents.split('\n');

            postedQuiz = [];
            for (let i = 0; i < lines.length; i++) {
                const items = lines[i].split(',');

                const content = items[0].trim();
                const answer = items[1].trim();
                const comment = items[2].trim();

                const eQuiz = $(`
                    <tr class="quiz">
                    <td class="content">${sanitize(content).split('\n').join("<br>")}</td>
                    <td class="answer">${sanitize(answer)}</td>
                    <td class="comment">${sanitize(comment).split('\n').join("<br>")}</td>
                    </tr>
                `);

                $("#posted-quiz").append(eQuiz);

                postedQuiz.push({
                    content: content, answer: answer, comment: comment
                });
            }
        };
        reader.readAsText(file);
    });

    $('#post-many-quiz').submit(async function (event) {
        event.preventDefault(); // デフォルトのフォーム送信動作をキャンセル

        console.log(postedQuiz);
        const response = await axios.post("/post_many_quiz", {
            quiz: postedQuiz
        });

        window.location.href = "/";
        return false;
    });
});