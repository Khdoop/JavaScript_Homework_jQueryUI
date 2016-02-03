(function() {
    //### variables ###
    var getPreview,
        path,
        current,
        arrayTours = $('#tours-list').find('ul li'),
        arrayInfo = [
            'Magnificent artwork, landscaping and architecture',
            'Awesome FREE place in L.A.',
            'Amazing place',
            'The shuttle is AMAZING.',
            'This place is a WOW!',
            'Nice place',
            'beautiful view',
            'Great venue for standing in line',
            'One of my favourites in LA',
            'Perfect for a rainy day'
        ];

    //### jQueryUI stuff ###
    $('#date').datepicker();
    $('#from-city').selectmenu();
    $('#to-city').selectmenu();
    //### available tours ###
    $(arrayTours).draggable({
        appendTo: "body",
        helper: "clone"
    }).parent().parent().parent().find('.panel-heading').on('click', function() {
        $(this).parent().find('.panel-body').slideToggle();
    });

    //### tooltip preview ###
    for (var i = 0; i < arrayTours.length; i++) {
        current = i;
        getPreview = current + 1;
        getPreview = parseInt(getPreview) > 9 ? getPreview : '0' + getPreview;
        path = 'images/preview' + getPreview + '.jpg';
        $(arrayTours[i]).tooltip({
            html: 'yes',
            title: '<img class="img-responsive img-thumbnail center-block" src="'+ path +'"><blockquote><p>' + arrayInfo[current] + '</p><footer><cite title="Source Title">tripadvisor.com</cite></footer></blockquote>',
            placement: 'left'
        });
    }

    //### your tours ###
    $('#cart').find('ol').droppable({
        activeClass: "ui-state-default",
        accept: ":not(.ui-sortable-helper)",
        drop: function( event, ui ) {
            $(this).find(".placeholder").remove();
            if ($(this).find('li').length <= 2) {
                var buildLi = '<li seq=\"' + ui.draggable.attr('seq') + '">' + ui.draggable.text() + "&nbsp;&nbsp;&nbsp;<span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span></li>"
                $(buildLi).appendTo(this);
            }
        }
    }).sortable({
        items: "li:not(.placeholder)",
        sort: function() {
            $(this).removeClass( "ui-state-default" );
        }
    });

    //### remove from tours list ###
    $('body').on('click', '.glyphicon-trash', function() {
        var $list = $(this).parent().parent();
        $(this).parent().remove();

        if (!($list.find('li').length)) {
            $list.append('<li class="placeholder">Add your tours here</li>');
        }
    });

    //### form ops ###
    $('form').on('submit', function(e) {
        e.preventDefault();
        //### reset coloring / errors ###
        $(this)
            .find('.has-error')
                .removeClass('has-error')
            .end()
            .find('.has-success')
                .removeClass('has-success')
            .end()
            .find('#cart')
                .removeClass('panel-danger')
                .removeClass('panel-success')
                .addClass('panel-info')
            .end()
            .find('span.error')
                .remove()
            .end()
            .find('br')
                .remove();
        //### form variables ###
        var formName = $(this).find('#name'),
            formSurname = $(this).find('#surname'),
            formDate = $(this).find('#date'),
            formFromCity = $(this).find('#from-city'),
            formToCity = $(this).find('#to-city'),
            formTours = $(this).find('#cart').find('.panel-body ol li'),
            errors = {};

        //### form validate ###
        //first name
        if (!validateRequired(formName)) {
            errors.name = 'First name is required.';
        } else if (!validateLength(formName, 2)) {
            errors.name = 'Min first name length is 2.';
        } else if (!validateAlpha(formName)) {
            errors.name = 'Allowed chars a-zA-Z';
        }
        //surname
        if (!validateRequired(formSurname)) {
            errors.surname = 'Surname is required.';
        } else if (!validateLength(formSurname, 2)) {
            errors.surname = 'Min surname length is 2.';
        } else if (!validateAlpha(formSurname)) {
            errors.surname = 'Allowed chars a-zA-Z';
        }
        //date
        if (!validateRequired(formDate)) {
            errors.date = 'Date is required.';
        } else if (!validateDate(formDate)) {
            errors.date = 'Invalid date.';
        }
        //from city
        if (!validateRequired(formFromCity)) {
            errors.fromCity = 'This field si required.';
        } else if (parseInt(formFromCity.val()) < 1 || parseInt(formFromCity.val()) > 4) {
            errors.fromCity = 'Invalid city.'
        }
        //to city
        if (!validateRequired(formToCity)) {
            errors.toCity = 'This field si required.';
        } else if (parseInt(formToCity.val()) < 1 || parseInt(formToCity.val()) > 4) {
            errors.toCity = 'Invalid city.'
        }
        //tours
        if (formTours.length != 3) {
            errors.tours = 'Choose 3 tours.'
        }

        //### put errors ###
        //first name
        if (errors.name) {
            formName.parent()
                .append('<span class="error text-danger">' + errors.name + '</span>')
                .addClass('has-error');
        } else {
            formName.parent().addClass('has-success');
        }
        //surname
        if (errors.surname) {
            formSurname.parent()
                .append('<span class="error text-danger">' + errors.surname + '</span>')
                .addClass('has-error');
        } else {
            formSurname.parent().addClass('has-success');
        }
        //date
        if (errors.date) {
            formDate.parent()
                .append('<span class="error text-danger">' + errors.date + '</span>')
                .addClass('has-error');
        } else {
            formDate.parent().addClass('has-success');
        }
        //from city
        if (errors.fromCity) {
            formFromCity.parent()
                .append('<span class="error text-danger">' + errors.fromCity + '</span>')
                .addClass('has-error');
        } else {
            formFromCity.parent()
                .addClass('has-success')
                .find('span').css({'border-color': '#3c763d', 'color': '#3c763d'});
        }
        //to city
        if (errors.toCity) {
            formToCity.parent()
                .append('<span class="error text-danger">' + errors.toCity + '</span>')
                .addClass('has-error');
        } else {
            formToCity.parent()
                .addClass('has-success')
                .find('span').css({'border-color': '#3c763d', 'color': '#3c763d'});
        }
        //tours
        if (errors.tours) {
            $('#cart')
                .after('<span class="error text-danger">' + errors.tours + '</span><br>')
                .addClass('panel-danger')
                .removeClass('panel-info');
        } else {
            $('#cart')
                .addClass('panel-success')
                .removeClass('panel-info');
        }

        console.log(Object.keys(errors).length);
        //### return if errors ###
        if (Object.keys(errors).length) return false;

        //### swap content ###

        var from = formFromCity.parent().find('span span:last-child').text();
        var to = formToCity.parent().find('span span:last-child').text();

        var startVacation = Date.parse(formDate.val());
        startVacation = new Date(startVacation);
        var endVacation = new Date(startVacation);
        endVacation.setDate(startVacation.getDate() + 3);
        startVacation = startVacation.toDateString();
        endVacation = endVacation.toDateString();
        console.log(formTours[0]);
        $(this).remove();
        $('#main').find('div:first-child').after(
            '<div class="col-lg-6 text-success text-center">' +
                '<p><b>You have successfully booked your vacation!</b></p>' +
                '<h4>' + formName.val() + ' ' + formSurname.val() + '</h4>' +
                '<h4>' + from + ' - ' + to + '</h4>' +
                '<h4>Period: '+ startVacation + ' - ' + endVacation + '</h4>' +
                '<div class="panel panel-success">' +
                    '<div class="panel-heading">Your tours</div>' +
                    '<div class="panel-body">' +
                        '<img class="img-responsive img-thumbnail" src="images/preview' + formTours.eq(0).attr('seq') + '.jpg">' +
                        '<div>' + formTours[0].textContent + '</div>' +
                        '<img class="img-responsive img-thumbnail" src="images/preview' + formTours.eq(1).attr('seq') + '.jpg">' +
                        '<div>' + formTours[1].textContent + '</div>' +
                        '<img class="img-responsive img-thumbnail" src="images/preview' + formTours.eq(2).attr('seq') + '.jpg">' +
                        '<div>' + formTours[2].textContent + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    });
})();