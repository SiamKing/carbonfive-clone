try{Typekit.load();}catch(e){}

$(document).ready(function() {
  $().showUp('.navbar');

  $('.navbar-toggle').on('click', function() {
    var toggle = $(this);
    var expanded = toggle.hasClass('expanded');
    if (expanded) {
      toggle.removeClass('expanded');
    } else {
      toggle.addClass('expanded');
    }
  });

  if ($('.sections-fullpage').length == 1) {
    $('.sections-fullpage').fullpage({
      slidesNavigation: true,
      resize: false,
      controlArrowColor: 'rgba(255, 255, 255, .2)',
      css3: true,
      scrollingSpeed: 750,
      controlArrowColor: '#fff',
      anchors:['section1', 'section2', 'section3', 'section4', 'section5'],
      responsive: 768,
      fixedElements: '.body-frame',
      onLeave: function(index, nextIndex, direction) {
        if (nextIndex == 1 || nextIndex < index) {
          $('nav.navbar').removeClass('navbar-hide').addClass('navbar-show');
        } else {
          $('nav.navbar').removeClass('navbar-show').addClass('navbar-hide');
        }
      }
    });
  }

  $('[data-filter]').on('click', function() {
    var link = $(this);
    var listItem = link.parent();
    var listItems = listItem.siblings().andSelf();
    var filter = link.data('filter');
    if (listItem.hasClass('active') || filter == 'all') {
      listItems.removeClass('active');
      $('[data-filter="all"]').parent().addClass('active');
      $('[data-categories]').addClass('active');
    } else {
      listItems.removeClass('active');
      listItem.addClass('active');
      $('[data-categories]').removeClass('active');
      $('[data-categories*="' + filter + '"]').addClass('active');
    }
    return false;
  });

  function displayContactFields() {
    var subject = $('form#contact input[name="Field1"]:checked').val();
    $('#recruit-fields, #lead-fields').slideUp('fast');
    if (subject == 'recruit') {
      $('#recruit-fields').slideDown('fast');
    } else if (subject == 'lead') {
      $('#lead-fields').slideDown('fast');
    }
  }

  $('form#contact input[name="Field1"]').click(function() {
    displayContactFields();
  });

  if ($('form#contact').length == 1) {
    displayContactFields();
  }

  function getCookie(name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length == 2) return parts.pop().split(';').shift();
  }

  if ($('form#newsletter').length == 1) {
    $('form#newsletter').submit(function(e) {
      e.preventDefault();
      var form = $(this);
      var url = form.attr('action');
      var portalId = form.find('input[name="portalId"]').val();
      var formId = form.find('input[name="formId"]').val();
      var email = form.find('input[name="email"]').val();
      var post = $.post(url, {
        hs_context: {
          'hutk': getCookie('hubspotutk'),
          'ipAddress': '192.168.1.12',
          'pageUrl': 'http://demo.hubapi.com/contact/',
          'pageName': 'Contact Us',
          'redirectUrl': 'http://demo.hubapi.com/thank-you/'
        },
        portalId: portalId,
        formId: formId,
        email: email
      });
      post.done(function(data) {
        console.log(data);
      });
    });
  }

  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if ($('.events').length == 1) {
    var events = $('.events:first');
    var calendarAPI = 'https://www.googleapis.com/calendar/v3/calendars/carbonfive.com_b6hbc27qk02c1mog8ce1k6n1ho@group.calendar.google.com/events';
    var maxResults = events.data('max-results') ? events.data('max-results') : '12';
    var now = new Date();
    $.getJSON(calendarAPI, {
      'key': 'AIzaSyC2FjKcvr6BX7VATsG_yAVS3Zr5nRJKJac',
      'orderby': 'starttime',
      'maxResults': maxResults,
      'singleEvents': 'true',
      'timeMin': now.toISOString(),
      'orderBy': 'startTime'
    }).done(function(data) {
      $.each(data.items, function(i, entry) {
        var link = entry.htmlLink;
        if (entry.description && entry.description.lastIndexOf('http', 0) == 0) {
          link = entry.description.split(/\s/)[0];
        }
        var date = new Date(Date.parse(entry.start.dateTime ? entry.start.dateTime : entry.start.date));
        var location = entry.location ? entry.location : '';
        if (location.indexOf('San Francisco') != -1) {
          loc = 'sf';
        } else if (location.indexOf('Santa Monica') != -1) {
          loc = 'la';
        } else if (location.indexOf('Chattanooga') != -1) {
          loc = 'cha';
        } else if (location.indexOf('New York') != -1) {
          loc = 'nyc';
        } else {
          loc = 'unk'
        }
        var event = events.find('.event').eq(i);
        event.addClass('event-' + loc);
        event.find('a').addBack('a').attr('href', link).attr('target', '_blank');
        event.find('h1').html(entry.summary);
        if (date) {
          event.find('h3').html(months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear());
        }
      });
      if ($('.sections-fullpage').length == 1) {
        $.fn.fullpage.reBuild();
      }
    });
  }

});
