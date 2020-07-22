var global = {"version": "1.0"}

jQuery(document).ready(function ($) {
  if (window.history && window.history.pushState) {
    //window.history.pushState('forward', null, './#forward');
    $(window).on('popstate', function () {
      global.getPage();
    });
  }
  global.setup();
});

global.setup = function () {
  global.getPage()
  $(".nav-link").on("click", function () {
    global.getPage($(this).attr("href").substr(3))
  })
}

global.get = function (name) {
  $(".nav-link").removeClass("active")
  $(".nav-link[href='#p-" + name + "']").addClass("active")

  $("#pages .page").hide();

  // Remove all iframe src
  $("#pages .page iframe").each(function () {
    $(this).attr("src", "")
  })

  if ($("#pages .page-" + name).length) {
    $("#pages .page-" + name).show();
    $("#pages .page-" + name + " iframe").each(function () {
      $(this).attr("src", $(this).attr("data-src"))
    })

  } else {
    let cls = 'page-' + name;
    $("#pages").append('<div class="page ' + cls + '"></div>');
    $("#pages ." + cls).load("pages/" + name + ".html?t=" + Date.now(), function () {
      $("#pages .page-" + name + " iframe").each(function () {
        $(this).attr("src", $(this).attr("data-src"))
      })
    })
  }

}

global.getPage = function (page) {
  if ((typeof (page) == "undefined") || (page === "")) {
    var hash = window.location.hash.substr(1);
    page = "";
    if (hash.substr(0, 2) == "p-") {
      page = hash.substr(2);
    }
    if (page == "") {
      page = "accueil";
    }
  }
  global.get(page)
}

