---
---
$ ->
  $('.momentConvert').each (index, element) =>
    $(element)
      .attr('title', moment($(element).attr('data-datetime')).format('LLL zz'))
      .html(moment($(element).attr('data-datetime')).fromNow())
  