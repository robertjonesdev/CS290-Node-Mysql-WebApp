// Source code for Bootstrap modal adapted from :
// https://getbootstrap.com/docs/4.0/components/modal/
$('#exampleModal').on('show.bs.modal', function (event) {

  var button = $(event.relatedTarget) // Button that triggered the modal
  var recipient = button.data('whatever') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).

  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)
  modal.find('.modal-title').text('Edit Workout # ' + recipient)
  document.editRow.editId.value = recipient;
  document.editRow.editName.value =   document.getElementById('elem-' + recipient + '-name').innerHTML;
  document.editRow.editReps.value = Number(document.getElementById('elem-' + recipient + '-reps').innerHTML);
  document.editRow.editWeight.value =   Number(document.getElementById('elem-' + recipient + '-weight').innerHTML);
  document.editRow.editDate.value =  document.getElementById('elem-' + recipient + '-date').innerHTML;
  if (document.getElementById('elem-'+recipient+'-lbs').innerHTML == "lbs"){
        document.editRow.editLbs[0].checked = true;
        document.editRow.editLbs[1].checked = false;
  }else {
      document.editRow.editLbs[1].checked = true;
      document.editRow.editLbs[0].checked = false;
  }

})

function formatDate(date) {
    //Source: https://stackoverflow.com/questions/23593052/format-javascript-date-to-yyyy-mm-dd
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + (d.getDate()),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
