let img_post = $('div.wrap-content > p > img');
$.map(img_post, function(e) {
    let subtitle = e.alt;
    let link = e.src;
    $('<p class="img-subtitle">' + subtitle + '</p>').insertAfter(e);
    $(e).wrap("<a href=" + link + " target='_blank'></a>");
});
$.map(img_post.parent(), function(e) {
    $(e).addClass('p_img');
});