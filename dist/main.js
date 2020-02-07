const iprodInput = document.getElementById('iprod');
const ipriceInput = document.getElementById('iprice');
const form = document.getElementById('upload-form');
const resultsDiv = document.getElementById('results');
const submitButton = document.getElementById('submit');

//submit button will be disabled unless both the inputs are entered
submitButton.disabled = true;

const updateSubmitButtonOnChange = () => {
  if (ipriceInput.files.length && iprodInput.files.length)
    submitButton.disabled = false;
  else submitButton.disabled = true;
};

ipriceInput.addEventListener('change', updateSubmitButtonOnChange);
iprodInput.addEventListener('change', updateSubmitButtonOnChange);

const makeDownloadButton = text => {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
  const downloadLink = document.createElement('a');
  downloadLink.id = 'download';
  downloadLink.href = url;
  downloadLink.download = 'catalog.txt';
  downloadLink.innerHTML = 'DOWNLOAD CATALOG';
  downloadLink.className = 'btn btn-primary';
  resultsDiv.className = '';
  resultsDiv.appendChild(downloadLink);
};

const handleSubmit = evt => {
  evt.preventDefault();
  const iprod = iprodInput.files[0];
  const iprice = ipriceInput.files[0];
  const formData = new FormData();
  formData.set('IPROD', iprod);
  formData.set('IPRICE', iprice);

  //remove download button if it already exists
  const download = document.getElementById('download');
  download && download.remove();
  resultsDiv.className = 'spinner-border text-primary';

  fetch('/make-catalog', {
    method: 'POST',
    body: formData,
  })
    .then(res => res.text())
    .then(text => makeDownloadButton(text))
    .catch(e => console.error(e));
};

form.addEventListener('submit', handleSubmit);
