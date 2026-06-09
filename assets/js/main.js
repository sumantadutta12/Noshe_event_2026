(function ($) {
  "use strict";

  function showOnScroll() {
    $(".content-section, .stats-section, .hero-copy, .hero-collage").each(function () {
      var $section = $(this);
      if ($(window).scrollTop() + $(window).height() > $section.offset().top + 80) {
        $section.addClass("visible");
      }
    });
  }

  function setActiveNav() {
    if ($("body").hasClass("agenda-page") || $("body").hasClass("contact-page") || $("body").hasClass("about-page") || $("body").hasClass("foreword-page") || $("body").hasClass("organisers-page") || $("body").hasClass("brochure-page") || $("body").hasClass("delegate-page") || $("body").hasClass("committee-page")) {
      return;
    }

    var currentTop = $(window).scrollTop() + 100;

    $("section[id]").each(function () {
      var $section = $(this);
      var id = $section.attr("id");

      if (currentTop >= $section.offset().top && currentTop < $section.offset().top + $section.outerHeight()) {
        $(".navbar .nav-link").removeClass("active");
        $('.navbar .nav-link[href="#' + id + '"]').addClass("active");
      }
    });
  }

  function animateCounters() {
    var $numbers = $("#numbers");

    if (!$numbers.length || $numbers.data("counted")) {
      return;
    }

    if ($(window).scrollTop() + $(window).height() > $numbers.offset().top + 80) {
      $numbers.data("counted", true);

      $(".counter").each(function () {
        var $counter = $(this);
        var target = parseInt($counter.data("count"), 10);

        $({ value: 0 }).animate(
          { value: target },
          {
            duration: 1400,
            easing: "swing",
            step: function (now) {
              $counter.text(Math.floor(now));
            },
            complete: function () {
              $counter.text(target);
            }
          }
        );
      });
    }
  }

  $(function () {
    $(".content-section, .stats-section, .hero-copy, .hero-collage").addClass("fade-up");

    showOnScroll();
    setActiveNav();
    animateCounters();

    // Smooth scrolling and mobile menu close behavior
    $('a[href^="#"]').on("click", function (event) {
      var href = this.getAttribute("href");

      if (!href || href === "#") {
        return;
      }

      var target = $(href);

      if (target.length) {
        event.preventDefault();
        $("html, body").animate(
          {
            scrollTop: target.offset().top - 70
          },
          550
        );
        $(".navbar-collapse").collapse("hide");
      }
    });

    // Keep dropdown parent scrollable when clicked from the menu text
    $(".dropdown-item").on("click", function () {
      $(".navbar-collapse").collapse("hide");
    });

    // Phone country selector behavior
    $(".country-trigger").on("click", function (event) {
      event.stopPropagation();
      var $field = $(this).closest(".phone-field");

      $(".phone-field").not($field).removeClass("open").find(".country-trigger").attr("aria-expanded", "false");
      $field.toggleClass("open");
      $(this).attr("aria-expanded", $field.hasClass("open") ? "true" : "false");
    });

    $(".country-option").on("click", function (event) {
      event.stopPropagation();
      var $option = $(this);
      var $field = $option.closest(".phone-field");

      $field.find(".country-option").removeClass("active");
      $option.addClass("active");
      $field.find(".flag").text($option.data("flag"));
      $field.find(".dial-code").text($option.data("code"));
      $field.removeClass("open");
      $field.find(".country-trigger").attr("aria-expanded", "false");
      $field.find(".phone-input").trigger("focus");
    });

    $(document).on("click", function () {
      $(".phone-field").removeClass("open").find(".country-trigger").attr("aria-expanded", "false");
      $(".timezone-select-wrap").removeClass("open").find(".timezone-select-trigger").attr("aria-expanded", "false");
    });

    $(".timezone-open").on("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      var offset = $(this).closest(".timezone-bar").position();
      $(".timezone-popover")
        .addClass("open")
        .attr("aria-hidden", "false")
        .css({
          top: offset.top + $(this).closest(".timezone-bar").outerHeight() + 8,
          left: 0
        });
    });

    $(".timezone-close, .timezone-cancel, .timezone-change").on("click", function () {
      $(".timezone-popover").removeClass("open").attr("aria-hidden", "true");
      $(".timezone-select-wrap").removeClass("open").find(".timezone-select-trigger").attr("aria-expanded", "false");
    });

    $(".timezone-dialog, .timezone-open").on("click", function (event) {
      event.stopPropagation();
    });

    $(".timezone-select-trigger").on("click", function (event) {
      event.stopPropagation();
      var $wrap = $(this).closest(".timezone-select-wrap");

      $wrap.toggleClass("open");
      $(this).attr("aria-expanded", $wrap.hasClass("open") ? "true" : "false");
    });

    $(".timezone-options button").on("click", function () {
      var $option = $(this);
      var $wrap = $option.closest(".timezone-select-wrap");

      $wrap.find(".timezone-options button").removeClass("active");
      $option.addClass("active");
      $wrap.find(".timezone-select-trigger span").text($option.text());
      $wrap.removeClass("open");
      $wrap.find(".timezone-select-trigger").attr("aria-expanded", "false");
    });

    // Agenda filter drawer and collapsible groups
    $(".filter-btn").on("click", function () {
      $("body").addClass("filter-open");
      $(".filter-overlay, .filter-sidebar").addClass("open").attr("aria-hidden", "false");
    });

    $(".filter-close, .filter-overlay, .filter-apply").on("click", function () {
      $("body").removeClass("filter-open");
      $(".filter-overlay, .filter-sidebar").removeClass("open").attr("aria-hidden", "true");
    });

    $(".filter-clear").on("click", function () {
      $(".filter-sidebar input[type='checkbox']").prop("checked", false);
      $(".filter-search input").val("");
    });

    $(".filter-group-toggle").on("click", function () {
      var $button = $(this);
      var $target = $($button.data("filter-target"));
      var willOpen = !$target.hasClass("open");

      $target.toggleClass("open", willOpen);
      $button.toggleClass("collapsed", !willOpen);
      $button.find(".fa-circle-chevron-right, .fa-circle-chevron-down")
        .toggleClass("fa-circle-chevron-right", !willOpen)
        .toggleClass("fa-circle-chevron-down", willOpen);
    });

    // Agenda session detail modal
    var sessionDetails = {
      "Registration": {
        meta: "Wed, Jun 25, 2025, 09:00 AM - 10:00 AM (IST)",
        speakers: []
      },
      "Inaugural Session": {
        meta: "Wed, Jun 25, 2025, 10:00 AM - 11:30 AM (IST)",
        venue: "Saraswati Auditorium",
        speakers: [
          { name: "Shri. Gurdeep Singh", role: "Chairman & Managing Director", org: "NTPC Limited", img: "assets/images/agenda-speaker-1.jpg" },
          { name: "Shri. Ravindra Kumar", role: "Director (Operations)", org: "NTPC Ltd.", img: "assets/images/agenda-speaker-3.jpg" },
          { name: "Dr. Shyam Pingle", role: "Vice President", org: "ICOH", img: "assets/images/agenda-speaker-5.jpg", social: true },
          { name: "Shri. Anil Kumar Jadli", role: "Director (HR)", org: "NTPC Limited", img: "assets/images/agenda-speaker-1.jpg" },
          { name: "Dr. Lalit R. Gabhane", role: "Director General", org: "National Safety Council", img: "assets/images/agenda-speaker-3.jpg" },
          { name: "Dr. Sumit Roy", role: "Deputy Director General", org: "DGFASLI", img: "assets/images/agenda-speaker-5.jpg" },
          { name: "Ms. Rachna Singh Bhal", role: "Executive Director - PMI", org: "NTPC Limited", img: "assets/images/agenda-speaker-2.jpg" }
        ]
      },
      "Refreshment Break": {
        meta: "Wed, Jun 25, 2025, 11:30 AM - 12:00 PM (IST)",
        speakers: []
      },
      "Opening Plenary: Integrating Climate Action with Safe Workplace & Occupational Health for a Resilient Future": {
        meta: "Wed, Jun 25, 2025, 12:00 PM - 01:00 PM (IST)",
        venue: "Saraswati Auditorium",
        speakers: [
          { name: "Shri. Anil Kumar Jadli", role: "Director (HR)", org: "NTPC Limited", img: "assets/images/agenda-speaker-1.jpg" },
          { name: "Shri. Shivam Srivastava", role: "Director (Fuel)", org: "NTPC Limited", img: "assets/images/agenda-speaker-3.jpg" },
          { name: "Shri. Uttam Lal", role: "Director Personnel", org: "NHPC Ltd.", img: "assets/images/agenda-speaker-5.jpg" },
          { name: "Dr. Lalit R. Gabhane", role: "Director General", org: "National Safety Council", img: "assets/images/agenda-speaker-3.jpg" },
          { name: "Dr. Ravi Rathod", role: "General Manager- Policy and Strategic Affairs (Regulatory)", org: "Innovation Healthcare Private Limited", img: "assets/images/agenda-speaker-4.jpg", social: true }
        ]
      }
    };

    var $sessionItems = $(".agenda-item");
    var currentSessionIndex = 0;
    var avatarSpeakerMap = {
      "agenda-speaker-1.jpg": { name: "Shri. Gurdeep Singh", role: "Chairman & Managing Director", org: "NTPC Limited" },
      "agenda-speaker-2.jpg": { name: "Ms. Rachna Singh Bhal", role: "Executive Director - PMI", org: "NTPC Limited" },
      "agenda-speaker-3.jpg": { name: "Shri. Ravindra Kumar", role: "Director (Operations)", org: "NTPC Ltd." },
      "agenda-speaker-4.jpg": { name: "Dr. Ravi Rathod", role: "General Manager - Policy and Strategic Affairs", org: "Innovation Healthcare Private Limited" },
      "agenda-speaker-5.jpg": { name: "Dr. Shyam Pingle", role: "Vice President", org: "ICOH" },
      "agenda-speaker-6.jpg": { name: "Dr. Sumit Roy", role: "Deputy Director General", org: "DGFASLI" }
    };
    var speakerSessionMap = {
      "Shri. Gurdeep Singh": [
        { title: "Inaugural Session", date: "Day - 1 : Wed, Jun 25, 2025", time: "10:00 AM - 11:30 AM (IST)", venue: "Saraswati Auditorium" },
        { title: "Closing Plenary: OSH Excellence Pathways: Reflections and Commitments for a Viksit Bharat", date: "Day - 2 : Thu, Jun 26, 2025", time: "03:20 PM - 05:00 PM (IST)", venue: "Saraswati Auditorium" }
      ],
      "Ms. Rachna Singh Bhal": [
        { title: "Inaugural Session", date: "Day - 1 : Wed, Jun 25, 2025", time: "10:00 AM - 11:30 AM (IST)", venue: "Saraswati Auditorium" },
        { title: "Closing Plenary: OSH Excellence Pathways: Reflections and Commitments for a Viksit Bharat", date: "Day - 2 : Thu, Jun 26, 2025", time: "03:20 PM - 05:00 PM (IST)", venue: "Saraswati Auditorium" }
      ],
      "Shri. Ravindra Kumar": [
        { title: "Inaugural Session", date: "Day - 1 : Wed, Jun 25, 2025", time: "10:00 AM - 11:30 AM (IST)", venue: "Saraswati Auditorium" }
      ]
    };

    function getSessionTitle($item) {
      return $.trim($item.find(".agenda-content h2").first().text());
    }

    function getFallbackSession($item) {
      var title = getSessionTitle($item);
      var time = $.trim($item.find("time").first().text());
      var duration = $.trim($item.find(".agenda-content p").first().text()).replace(/\s+/g, " ");

      return {
        meta: "Wed, Jun 25, 2025, " + time + " (IST)",
        note: duration,
        speakers: []
      };
    }

    function renderSession(index) {
      currentSessionIndex = (index + $sessionItems.length) % $sessionItems.length;

      var $item = $sessionItems.eq(currentSessionIndex);
      var title = getSessionTitle($item);
      var detail = sessionDetails[title] || getFallbackSession($item);
      var metaHtml = detail.meta || "";

      if (detail.venue) {
        metaHtml += ' <i class="fa-solid fa-location-dot"></i> ' + detail.venue;
      }

      $("#sessionModalTitle").text(title);
      $(".session-meta").html(metaHtml);

      var speakers = detail.speakers || [];
      var $wrap = $(".session-speakers-wrap");
      var $list = $(".session-speakers");

      $list.empty();
      $wrap.toggleClass("has-speakers", speakers.length > 0);

      speakers.forEach(function (speaker) {
        var social = speaker.social ? '<span class="session-social"><i class="fa-brands fa-linkedin-in"></i></span>' : "";
        $list.append(
          '<div class="session-speaker">' +
            '<img class="session-speaker-img" src="' + speaker.img + '" alt="' + speaker.name + '" data-name="' + speaker.name + '" data-role="' + speaker.role + '" data-org="' + speaker.org + '">' +
            '<div><strong>' + speaker.name + '</strong><span>' + speaker.role + '<br>' + speaker.org + '</span>' + social + '</div>' +
          '</div>'
        );
      });
    }

    function openSpeakerProfile(speaker, sessionContext) {
      var sessions = speakerSessionMap[speaker.name] || sessionContext || [
        { title: $("#sessionModalTitle").text(), date: "Day - 1 : Wed, Jun 25, 2025", time: $(".session-meta").text().split(", ").slice(2).join(", ").replace(" Saraswati Auditorium", ""), venue: "Saraswati Auditorium" }
      ];

      $(".speaker-profile-img").attr("src", speaker.img).attr("alt", speaker.name);
      $("#speakerProfileName").text(speaker.name);
      $(".speaker-profile-role").text(speaker.role);
      $(".speaker-profile-org").text(speaker.org);

      var $list = $(".speaker-session-list").empty();
      sessions.forEach(function (session) {
        $list.append(
          '<article class="speaker-session-card">' +
            '<h4>' + session.title + '</h4>' +
            '<div class="speaker-session-meta">' +
              '<span><i class="fa-solid fa-calendar-day"></i>' + session.date + '</span>' +
              '<span><i class="fa-solid fa-clock"></i>' + session.time + '</span>' +
              '<span><i class="fa-solid fa-location-dot"></i>' + session.venue + '</span>' +
            '</div>' +
            '<span class="session-track"><i class="fa-solid fa-circle"></i> Track 1</span>' +
          '</article>'
        );
      });

      $("body").addClass("session-open");
      $(".speaker-profile-overlay").addClass("open").attr("aria-hidden", "false");
    }

    function openSessionModal(index) {
      renderSession(index);
      $("body").addClass("session-open");
      $(".session-modal-overlay").addClass("open").attr("aria-hidden", "false");
    }

    function closeSessionModal() {
      $("body").removeClass("session-open");
      $(".session-modal-overlay").removeClass("open").attr("aria-hidden", "true");
    }

    $sessionItems.on("click", function () {
      openSessionModal($sessionItems.index(this));
    });

    $(".agenda-item .avatar-row img").on("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var $image = $(this);
      var $item = $image.closest(".agenda-item");
      var fileName = ($image.attr("src") || "").split("/").pop();
      var speaker = $.extend({ img: $image.attr("src") }, avatarSpeakerMap[fileName] || {
        name: "Speaker",
        role: "Conference Speaker",
        org: "NOSHE 2025"
      });
      var detail = sessionDetails[getSessionTitle($item)];
      var timeText = detail && detail.meta ? detail.meta.replace("Wed, Jun 25, ", "") : $.trim($item.find("time").first().text()) + " (IST)";
      var sessionContext = [{
        title: getSessionTitle($item),
        date: "Day - 1 : Wed, Jun 25, 2025",
        time: timeText,
        venue: $item.find(".agenda-content p").first().text().indexOf("Saraswati Auditorium") !== -1 ? "Saraswati Auditorium" : "Pre Function Area"
      }];

      openSpeakerProfile(speaker, sessionContext);
    });

    $(".session-close").on("click", closeSessionModal);

    $(".session-modal-overlay").on("click", function (event) {
      if ($(event.target).is(".session-modal-overlay")) {
        closeSessionModal();
      }
    });

    $(".session-prev").on("click", function (event) {
      event.stopPropagation();
      renderSession(currentSessionIndex - 1);
    });

    $(".session-next").on("click", function (event) {
      event.stopPropagation();
      renderSession(currentSessionIndex + 1);
    });

    $(document).on("click", ".session-speaker-img", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openSpeakerProfile({
        name: $(this).data("name"),
        role: $(this).data("role"),
        org: $(this).data("org"),
        img: $(this).attr("src")
      });
    });

    function closeSpeakerProfile() {
      $(".speaker-profile-overlay").removeClass("open").attr("aria-hidden", "true");
      if (!$(".session-modal-overlay").hasClass("open")) {
        $("body").removeClass("session-open");
      }
    }

    $(".speaker-profile-close").on("click", closeSpeakerProfile);

    $(".speaker-profile-overlay").on("click", function (event) {
      if ($(event.target).is(".speaker-profile-overlay")) {
        closeSpeakerProfile();
      }
    });

    $(window).on("scroll resize", function () {
      showOnScroll();
      setActiveNav();
      animateCounters();
    });
  });
})(jQuery);
