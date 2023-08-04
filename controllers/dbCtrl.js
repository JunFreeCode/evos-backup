const firebaseConfig = require('../server/config/firebase');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, doc, getDoc, addDoc, setDoc} = require('firebase/firestore');

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

//DB원장 데이터 조회
const getData =  async (req, res) => {
    try {
        const collectionRef = collection(db, 'contractLedger');
        const querySnapshot = await getDocs(collectionRef);
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });

        res.json({data});
        
    } catch (error) {
        console.log('문서 조회 오류: ', error);
        res.status(500).json({ error: '문서 조회 오류 발생' });
    }
};

//DB원장 key값으로 조회
async function getDataByKey(key) {
    try {
      const collectionRef = collection(db, 'contractLedger'); // Replace 'your_collection' with the actual collection name
      const q = query(collectionRef, where('key', '==', key));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        return data;
      } else {
        throw new Error('No documents found with the given key');
      }
    } catch (error) {
      throw new Error('Error retrieving data: ' + error.message);
    }
  }

//DB저장
async function dbSaveData(req, res){
  try{
    const {NEW_ADD, PATH, BD_1, BD_2, NEW_CONST, BD_GROUP, BD_NAME, ADD_1, ADD_2, ADD_3, BD_PERSON_1, BD_PH_1, BD_EMAIN_1}  = req.body;

    //파이어스토어에서 년도별 시퀀스값 구하기
    const currentYear = new Date().getFullYear().toString();
    const contractSeqCollectionRef = collection(db, 'contract_seq');
    const contractSeqDocRef = doc(contractSeqCollectionRef,currentYear);
    const contractSeqDocSnapshot = await getDoc(contractSeqDocRef);
    let newContractMaxSeq = 1;
    if (contractSeqDocSnapshot.exists()) {
      // 해당 년도의 시퀀스 문서가 존재하는 경우, 현재 시퀀스 값을 가져옵니다.
      const currentContractMaxSeq = contractSeqDocSnapshot.data().contract_max_seq;
      newContractMaxSeq = extractSequentialNumber(currentContractMaxSeq) + 1;
    } else {
      // 해당 년도의 시퀀스 문서가 없는 경우, 새로운 시퀀스 문서를 생성합니다.
      await setDoc(contractSeqDocRef, { contract_max_seq: 'D' + currentYear.slice(-2) + '000001' });
    }

     // 현재 날짜 생성 (2023-07-30 형식으로 변환)
     const currentDate = new Date();
     const year = currentDate.getFullYear();
     const month = String(currentDate.getMonth() + 1).padStart(2, '0');
     const day = String(currentDate.getDate()).padStart(2, '0');
     const formattedDate = `${year}-${month}-${day}`;

    //contractLedger 컬렉션에 데이터 추가
    const collectionRef = collection(db, 'contractLedger');
    await addDoc(collectionRef,{
      //필드값
      NEW_ADD, PATH, BD_1, BD_2, NEW_CONST, BD_GROUP, BD_NAME, ADD_1, ADD_2, ADD_3, BD_PERSON_1, BD_PH_1, BD_EMAIN_1,
      key :  'D' + addLeadingZeros(newContractMaxSeq, 6), // 증가된 시퀀스 값을 추가
      DB_DATE: formattedDate, // 현재 날짜를 2023-07-30 형식으로 저장
    });

    // contract_seq 컬렉션의 contract_max_seq 값을 업데이트합니다.
    await setDoc(contractSeqDocRef, { contract_max_seq: 'D' + addLeadingZeros(newContractMaxSeq, 6) });

    // 데이터 저장 성공 시 응답
    res.status(200).json({ success: true, message: '데이터 저장 성공' });
  }catch(error){
    // 데이터 저장 실패 시 응답
    res.status(500).json({ success: false, message: '데이터 저장 오류 발생' });
  }
}

// 문자열에서 순차적인 숫자 부분을 추출하는 함수
function extractSequentialNumber(sequence) {
  const numberPart = sequence.replace(/^\D+/g, '');
  return parseInt(numberPart);
}

// 지정한 길이만큼 숫자의 앞에 0을 추가하는 함수
function addLeadingZeros(number, length) {
  const numberStr = number.toString();
  return numberStr.padStart(length - 1, '0'); // Subtract 1 to make it 6 digits for the sequence number
}


//현장실사 미등록 데이터 조회
//DB원장 데이터 조회
const getfieldWorkUnData =  async (req, res) => {
  try {
      const collectionRef = collection(db, 'contractLedger');
      const querySnapshot = await getDocs(collectionRef);
      const data = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        if (docData.DB_STATUS === 'DB저장') {
          data.push(docData);
        }
      });

      res.json({data});
      
  } catch (error) {
      console.log('문서 조회 오류: ', error);
      res.status(500).json({ error: '문서 조회 오류 발생' });
  }
};


//실사신청 등록
async function surveySaveData(req, res){
  try {

    const INST_LOC = req.body['instLoc[]'];
    const SUPPLY_TYPE = req.body['supplyType[]'];
    const CPO = req.body['CPO[]'];
    const APPLY_MEMO = req.body.applyMemo;
    const COMPAINO_YN = req.body.companionYn;
    const SURVEY_DATE = req.body.surveyDate;
    const DATE_INPUT = req.body.dateInput;

    const {APPLY_FC, APPLY_PLOT, APPLY_SC, CHG_FC, CHG_PLOT, CHG_SC, DUTY_PLOT_2, DUTY_PLOT_5, EXIST_FC, EXIST_PLOT, EXIST_SC, FC_2,
      FC_5,P_LOT,SC_2,SC_5,TOTAL_2,TOTAL_5,TOTAL_APPLY,TOTAL_CHG,TOTAL_EXIST}  = req.body;
    
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const collectionRef = collection(db, "contractLedger");
    const keyToMatch = req.body.dbNo;  //key값
     // key 값과 일치하는 문서 조회
    const q = query(collectionRef, where("key", "==", keyToMatch));
    const querySnapshot = await getDocs(q);

     //일치하는 문서가 존재하는 경우 업데이트
     if (!querySnapshot.empty){
      const docToUpdate = querySnapshot.docs[0];
      await setDoc(docToUpdate.ref, {APPLY_FC, APPLY_PLOT, APPLY_SC, CHG_FC, CHG_PLOT, CHG_SC, CPO, DUTY_PLOT_2, DUTY_PLOT_5, EXIST_FC, EXIST_PLOT, EXIST_SC, FC_2,
        FC_5,P_LOT,SC_2,SC_5,TOTAL_2,TOTAL_5,TOTAL_APPLY,TOTAL_CHG,TOTAL_EXIST,APPLY_MEMO,COMPAINO_YN,INST_LOC, SUPPLY_TYPE,SURVEY_DATE,
        APPLY_DATE:formattedDate,
        APPLY_STATE:'실사요청',
        DB_STATUS:'실사요청',
        DATE_INPUT,
        }, { merge: true });
      console.log("기존 데이터가 업데이트되었습니다. 문서 ID:", docToUpdate.id);

      // 데이터 저장 성공 시 응답
      res.status(200).json({ success: true, message: '데이터 저장 성공' });
     }

  } catch (error) {
    console.error("데이터 저장 오류:", error);
    res.status(500).json({ success: false, message: '데이터 저장 오류 발생' });
  }
        
};


module.exports = {
    getData,
    getDataByKey,
    dbSaveData,
    getfieldWorkUnData,
    surveySaveData,
};