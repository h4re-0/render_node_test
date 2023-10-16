$(document).ready(function () {
    $('#post-quiz').submit(async function (event) {
        event.preventDefault(); // デフォルトのフォーム送信動作をキャンセル

        const content = $('textarea[name="content"]').val();
        const answer = $('textarea[name="answer"]').val();
        const comment = $('textarea[name="comment"]').val();

        const response = await axios.post("/post_quiz", {
            content: content,
            answer: answer,
            comment: comment
        });

        return false;
    });
});