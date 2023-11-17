var deliveryButton = document.getElementById('배송조회');
var customsclearanceButton = document.getElementById('통관조회');

deliveryButton.addEventListener('click', () => {
  var deliveryNum = document.getElementById('송장번호');
  var deliveryCompany = document.getElementById('택배회사');
  switch (deliveryCompany.value){
  case 'CJ대한통운':
    chrome.windows.create({url: `http://www.doortodoor.co.kr/parcel/doortodoor.do?fsp_action=PARC_ACT_002&fsp_cmd=retrieveInvNoACT&invc_no=${deliveryNum.value}`, type: "normal"});
    break;
  case '우체국택배':
    chrome.windows.create({url: `https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm?sid1=${deliveryNum.value}&displayHeader=N`, type: "normal"});
    break;
  case '롯데택배':
    chrome.windows.create({url: `https://www.lotteglogis.com/home/reservation/tracking/linkView?InvNo=${deliveryNum.value}`, type: "normal"});
    break;
  case '한진택배':
    chrome.windows.create({url: `https://www.hanjin.co.kr/kor/CMS/DeliveryMgr/WaybillResult.do?mCode=MN038&schLang=KR&wblnumText2=${deliveryNum.value}`, type: "normal"});
    break;
  case '로젠택배':
    chrome.windows.create({url: `http://d2d.ilogen.com/d2d/delivery/invoice_tracesearch_quick.jsp?slipno=${deliveryNum.value}`, type: "normal"});
    break;
  }
})

customsclearanceButton.addEventListener('click', async() => {
  var customsclearanceNum = document.getElementById('통관번호');
  var data;
  await fetch(`https://unipass.customs.go.kr:38010/ext/rest/cargCsclPrgsInfoQry/retrieveCargCsclPrgsInfo?crkyCn=p280x223n171w176d030u060y0&hblNo=${customsclearanceNum.value}&blYy=${new Date().getFullYear()}`, {method: 'GET'})
  .then(response => response.text())
  .then(result => data = result)
  .catch(error => alert('error', error));
  if (data){
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, 'application/xml');

    const shedNm = await xmlDoc.querySelectorAll('shedNm');
    const prcsDttm = await xmlDoc.querySelectorAll('prcsDttm');
    const cargTrcnRelaBsopTpcd = await xmlDoc.querySelectorAll('cargTrcnRelaBsopTpcd');

    let result = document.getElementById('result');
    let html = ``;

    if (shedNm.length!=0) {
      for (let i=0; i<shedNm.length; i++) {
        html+=`
        <p style="margin-bottom:0px">${changedate(prcsDttm[i].textContent)}</p>
        <p style="margin-top:0px; font-weight : bold;">${cargTrcnRelaBsopTpcd[i].textContent}</p>
        `;
      }
    }
    else{
      alert("송장번호를 다시 입력하세요.");
    }

    result.innerHTML=html;
  }
});

function changedate(date) {

  var year = date.substring(0, 4);
  var month = date.substring(4, 6);
  var day = date.substring(6, 8);
  var hour = date.substring(8, 10);
  var min = date.substring(10, 12);
  var sec = date.substring(12, 14);

  var changedate = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;

  return changedate;
}