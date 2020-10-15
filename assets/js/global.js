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

global.gotoAnchor = null;

global.setup = function () {
  let lang = $.cookie('lang')
  if (!lang) {
    var userLang = navigator.language || navigator.userLanguage;
    lang = userLang.split('-')[0]
  }
  lang = lang.toLowerCase()
  if (lang!='en') {
    lang = 'fr'
  }

  if (lang == 'fr') {
    $("html head title").html("Décrochons Macron - Procès à Valence")
  } else {
    $("html head title").html("Let's take down Macron - Trial in Valence")
  }

  var bits = window.location.href.split("?");
  /*
  if (bits[1] && ((bits[1] == 'en') || (bits[1] == 'fr'))) {
    lang = bits[1]
  }
  */
  if (bits[1] && (bits[1].substr(0, 4) == 'lang')) {
    $("body").attr("id", "")
  }


  $("body").addClass("lang-"+lang)
  
  global.getPage()
  $(".nav-link.click").on("click", function () {
    console.log("clicked");
    $('.navbar-collapse').collapse('hide');
    console.log("Hide menu")

    let href = $(this).attr("href");
    if ((href === '#NOOP') || (href === 'javascript:void(0);')) {
      return;
    }

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
      global.updateLinks(name)
      global.setMore(name)
      global.flags()
    })
  }

  if (global.gotoAnchor) {
    console.log("goto " + "#" + global.gotoAnchor)
    if ($("#" + global.gotoAnchor).length) {
      setTimeout(function () {
        $('html, body').animate({
          scrollTop: $("#" + global.gotoAnchor).offset().top
        }, 2000);
      }, 200)
    }
  }
}

global.flags = function () {
  $(".flags .item").unbind().on("click", function () {
    $(".showText").removeClass("showText")
    let lang = "fr"
    if ($(this).hasClass("en")) {
      $("body").removeClass("lang-fr")
      $("body").addClass("lang-en")
      lang = "en"
    } else {
      $("body").removeClass("lang-en")
      $("body").addClass("lang-fr")
    }
    $.cookie('lang', lang);
    if (lang == 'fr') {
      $("html head title").html("Décrochons Macron - Procès à Valence")
    } else {
      $("html head title").html("Let's take down Macron - Trial in Valence")
    }
  })
}

global.setMore = function (name) {
  $("#pages .page-" + name + " .more").on("click", function () {
    let p = $(this).closest(".info");
    if (p.hasClass("showText")) {
      p.removeClass("showText")
    } else {
      p.addClass("showText")
    }
  })

}

global.getPage = function (page) {
  global.gotoAnchor = null;
  if ((typeof (page) == "undefined") || (page === "")) {
    var hash = window.location.hash.substr(1);
    page = "";
    if (hash.substr(0, 2) == "p-") {
      page = hash.substr(2);
    }
    if (page == "") {
      page = "accueil";
    }
    if (hash == "NOOP") {
      return;
    }
  }

  let bits = page.split("/");
  page = bits[0];
  if (bits[1]) {
    global.gotoAnchor = bits[1];
  }
  //window.history.pushState('page' + page, 'Title', "#p-" + page);
  global.get(page)
}

global.updateLinks = function (name) {
  if (global.isIOS()) {
    if (name == 'header') {
      global.updateLinkIOS("#header a");
    } else if (name == 'footer') {
      global.updateLinkIOS("#footer a");
    } else {
      global.updateLinkIOS("#pages .page-" + name + " a");
    }
  } else if (global.isAndroid()) {
    if (name == 'header') {
      global.updateLinkAndroid("#header a");
    } else if (name == 'footer') {
      global.updateLinkAndroid("#footer a");
    } else {
      global.updateLinkAndroid("#pages .page-" + name + " a");
    }
  }
}
global.updateLinkIOS = function (dom) {
  $(dom).each(function () {
    if ($(this).attr("data-ios") !== '') {
      $(this).attr("href", $(this).attr("data-ios"));
      $(this).attr("target", null)
    }
  })

}

global.updateLinkAndroid = function (dom) {
  $(dom).each(function () {
    if ($(this).attr("data-android") !== '') {
      $(this).attr("href", $(this).attr("data-android"));
      $(this).attr("target", null)
    }
  })

}

global.isIOS = function () {
  return ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPod") != -1) || (navigator.platform.indexOf("iPad") != -1));

};
global.isAndroid = function () {
  var ua = navigator.userAgent.toLowerCase();
  return ua.indexOf("android") > -1;
};