/* eslint-disable prettier/prettier */
/* eslint-disable no-trailing-spaces */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */



const districtCodes = {
    
    Niassa: {
      "Chimbunila": '10',
      "Cuamba": '11',
      "Lago": '12',
      "Lichinga": '13',
      "Majune": '14',
      "Mandimba": '15',
      "Marrupa": '16',
      "Maúa": '17',
      "Mavago": '18',
      "Mecanhelas": '19',
      "Mecula": '20',
      "Metarica": '21',
      "Muembe": '22',
      "N'gauma": '23',
      "Nipepe": '24',
      "Sanga": '25',
    },
    // ],
  
    Nampula: {
      "Angoche": '50',
      "Eráti": '51',
      "Ilha de Moçambique": '52',
      "Lalaua": '53',
      "Larde": '54',
      "Liúpo": '55',
      "Malema": '56',
      "Meconta": '57',
      "Mecubúri": '58',
      "Memba": '59',
      "Mogincual": '60',
      "Mogovolas": '61',
      "Moma": '62',
      "Monapo": '63',
      "Mossuril": '64',
      "Muecate": '65',
      "Murrupula": '66',
      "Nacala": '67',
      "Nacala-a-Velha": '68',
      "Nacarôa": '69',
      "Nampula": '70',
      // "Nampula (Cidade)",
      "Rapale": '71',
      "Ribáuè": '72',
    },
    // ],
  
    "Cabo Delgado": {
      "Ancuabe": '30',
      "Balama": '31',
      "Chiúre": '32',
      "Ibo": '33',
      "Macomia": '34',
      "Mecúfi": '35',
      "Meluco": '36',
      "Metuge": '37',
      "Mocímboa da Praia": '38',
      "Montepuez": '39',
      "Mueda": '40',
      "Muidumbe": '41',
      "Namuno": '42',
      "Nangade": '43',
      "Palma": '44',
      "Pemba (Cidade)": '45',
      "Quissanga": '46',
    },
    // ],
  
    Zambézia: {
      "Alto Molócuè": '70',
      "Chinde": '81',
      "Derre": '82',
      "Gilé": '83',
      "Gurué": '84',
      "Ile": '85',
      "Inhassunge": '86',
      "Luabo": '87',
      "Lugela": '88',
      "Maganja da Costa": '89',
      "Milange": '90',
      "Mocuba": '91',
      "Mocubela": '92',
      "Molumbo": '93',
      "Mopeia": '94',
      "Morrumbala": '95',
      "Mulevala": '96',
      "Namacurra": '97',
      "Namarroi": '98',
      "Nicoadala": '99',
      "Pebane": '00',
      "Quelimane (Cidade)": '01',
    },
    // ],
  
    // // Tete: [
    //   "Angónia",
    //   "Cahora-Bassa",
    //   "Changara",
    //   "Chifunde",
    //   "Chiuta",
    //   "Dôa",
    //   "Macanga",
    //   "Magoé",
    //   "Marara",
    //   "Marávia",
    //   "Moatize",
    //   "Mutarara",
    //   "Tete (Cidade)",
    //   "Tsangano",
    //   "Zumbo",
    // // ],
  
    // // Gaza: [
    //   "Bilene",
    //   "Chibuto",
    //   "Chicualacuala",
    //   "Chigubo",
    //   "Chókwè",
    //   "Chongoene",
    //   "Guijá",
    //   "Limpopo",
    //   "Mabalane",
    //   "Mandlakazi",
    //   "Mapai",
    //   "Massangena",
    //   "Massingir",
    //   "Xai-Xai (Cidade)",
    // // ],
  
    // // Maputo: [
    //   "Boane",
    //   "Magude",
    //   "Manhiça",
    //   "Marracuene",
    //   "Matola",
    //   "Matutuíne",
    //   "Moamba",
    //   "Namaacha",
    // // ],
  
    // // "Maputo (Cidade)": [
    //   "KaMpfumu",
    //   "Nlhamankulu",
    //   "KaMaxakeni",
    //   "KaMavota",
    //   "KaMubukwana",
    //   "KaTembe",
    //   "KaNyaka",
    // // ],
  
    // // Manica: [
    //   "Bárue",
    //   "Chimoio (Cidade)",
    //   "Gondola",
    //   "Guro",
    //   "Macate",
    //   "Machaze",
    //   "Macossa",
    //   "Manica",
    //   "Mossurize",
    //   "Sussundenga",
    //   "Tambara",
    //   "Vanduzi",
    // // ],
  
    // // Inhambane: [
    //   "Funhalouro",
    //   "Govuro",
    //   "Homoíne",
    //   "Inhambane (Cidade)",
    //   "Inharrime",
    //   "Inhassoro",
    //   "Jangamo",
    //   "Mabote",
    //   "Massinga",
    //   "Maxixe",
    //   "Morrumbene",
    //   "Panda",
    //   "Vilankulo",
    //   "Zavala",
    // // ],
  
    // // Sofala: [
    //   "Beira (Cidade)",
    //   "Búzi",
    //   "Caia",
    //   "Chemba",
    //   "Cheringoma",
    //   "Chibabava",
    //   "Dondo",
    //   "Gorongosa",
    //   "Machanga",
    //   "Maringué",
    //   "Marromeu",
    //   "Muanza",
    //   "Nhamatanda",
    // // ],
      
  };
  
  export default districtCodes;
  





// const adminPostCEP = {
    

//   // Zambezia

//   Chinde: {
//       "Chinde-Sede": '01', 
//       "Micaune": '02',
//   },
//   Luabo: {
//       "Chimbazo": '01', 
//       "Luabo-Sede": '02',
//   },
//   Inhassunge: {
//       "Gonhane": '01',
//       "Inhassunge-Sede": '02', 
//   },
//   Quelimane: {
//       "Posto Admin. 1-Sede": '01',
//       "Posto Admin. 2": '02',
//       "Posto Admin. 3": '03',
//       "Posto Admin. 4": '04',
//       "Posto Admin. 5": '05',
//       "Maquival": '06',
//   },
//   Mopeia: {
//       "Campo": '01',
//       "Mopeia-Sede": '02', 
//   },
//   Namacurra: {
//       "Macuse": '01', 
//       "Namacurra-Sede": '02',
//   },
//   Nicoadala: {
//       "Nicoadala-Sede": '01',
//   },
//   "Maganja da Costa": {
//       "Baixo Licungo": '01', 
//       "Maganja-Sede": '02', 
//   },
//   Mocubela: {
//       "Bajone": '01',
//       "Mocubela-Sede": '02',
//   },
//   Mocuba: {
//       "Mocuba-Sede": '01', 
//       "Mugeba": '02', 
//       "Namanjavira": '03',
//   },
//   Derre: {
//       "Derre-Sede": '01', 
//       "Guerissa": '02',
//   },
//   Morrumbala: {
//       "Chire": '01', 
//       "Megaza": '02',
//       "Morrumbala-Sede": '03', 
//   },
//   Pebane: {
//       "Mulela": '01', 
//       "Naburi": '02',
//       "Pebane-Sede": '03', 
//   },
//   Mulevala: {
//       "Chiraco": '01',
//       "Mulevala-Sede": '02',
//   },
//   Lugela: {
//       "Lugela-Sede": '01', 
//       "Muabanama": '02',
//       "Munhamade": '03', 
//       "Tacuane": '04', 
//   },
//   Milange: {
//       "Majaua": '01', 
//       "Milange-Sede": '02',
//       "Mongue": '03',
//   },
//   Gilé: {
//       "Alto Ligonha": '01',
//       "Gilé-Sede": '02', 
//   },
//   "Alto Molócuè": {
//       "Molócuè-Sede": '01', 
//       "Nauela": '02',
//   },
//   Ile: {
//       "Ile-Sede": '01', 
//       "Namigonha": '02', 
//       "Socone": '03',
//   },
//   Namarroi: {
//       "Namarroi-Sede": '01',
//       "Regone": '02',
//   },
//   Molumbo: {
//       "Corromana": '01',
//       "Molumbo-Sede": '02',
//   },
//   Gurué: {
//       "Gurué-Sede": '01', 
//       "Lioma": '02', 
//       "Mepuagiua": '03',
//   },


//   // Nampula
//   Moma: {
//       "Chalaua": '01', 
//       "Moma-Sede": '02', 
//   },
//   Larde: {
//       "Larde-Sede": '01', 
//       "Mucuali": '02',
//   },
//   Angoche: {
//       "Angoche-Sede": '01', 
//       "Aube": '02', 
//       "Boila": '03',
//       "Namaponda": '04', 
//   },
//   Mogovolas: {
//       "Calipo": '01', 
//       "Iuluti": '02', 
//       "Muatua": '03', 
//       "Nametil-Sede": '04', 
//       "Nanhupo-Rio": '04',
//   },
//   Murrupula: {
//       "Chinga": '01', 
//       "Murrupula-Sede": '02', 
//       "Nihessiue": '03',
//   },
//   Liúpo: {
//       "Liúpo-Sede": '01',
//       "Quinga": '02',
//   },
//   Mogincual: {
//       "Namige-Sede": '01', 
//       "Quixaxe": '02', 
//   },
//   Meconta: {
//       "7 de Abril": '01',
//       "Corrane": '02', 
//       "Meconta-Sede": '03', 
//       "Namialo": '04', 
//   },
//   Nampula: {
//       "Anchilo": '01',
//       "Central-Sede": '02',
//       "Muatala": '03',
//       "Namicopo": '04',
//       "Napipine": '05',
//       "Natikire": '06',
//       "Muhala": '07',
//   },
//   Rapale: {
//       "Mutivasse": '01', 
//       "Namaita": '02',
//       "Rapale-Sede": '03', 
//   },
//   Ribaué: {
//       "Cunle": '01', 
//       "Iapala": '02',
//       "Ribaué-Sede": '03', 
//   },
//   Malema: {
//       "Malema-Sede": '01', 
//       "Mutuali": '02',
//   },
//   "Ilha de Moçambique": {
//       "Ilha de Moçambique-Sede": '01', 
//       "Lumbo": '02',
//   },
//   Mossuril: {
//       "Lunga": '01', 
//       "Matibane": '02',
//       "Mossuril-Sede": '03', 
//   },
//   Monapo: {
//       "Itoculo": '01', 
//       "Monapo-Sede": '02', 
//       "Netia": '03',
//   },
//   Muecate: {
//       "Imala": '01', 
//       "Muculuone": '02',
//       "Muecate-Sede": '03', 
//   },
//   Mecubúri: {
//       "Mecubúri-Sede": '01', 
//       "Milhana": '02', 
//       "Muite": '03', 
//       "Namina": '04',
//   },
//   Lalaua: {
//       "Lalaua-Sede": '01', 
//       "Meti": '02',
//   },
//   Nacala: {
//       "Muanona": '01',
//       "Mutiva-Sede": '02',
//   },
//   "Nacala-a-Velha": {
//       "Covo": '01',
//       "Nacala-a-Velha-Sede": '01', 
//   },
//   Nacarôa: {
//       "Inteta": '01', 
//       "Nacarôa-Sede": '02', 
//       "Saua-Saua": '03',
//   },
//   Memba: {
//       "Chipene": '01', 
//       "Lurio": '02', 
//       "Mazua": '03',
//       "Memba-Sede": '04', 
//   },
//   Eráti: {
//       "Alua": '01', 
//       "Namapa-Sede": '02', 
//       "Namiroa": '03',
//   },


//   //Cabo Delgado
//   Mecúfi: {
//       "Mecufi-Sede": '01', 
//       "Murrebue": '02',
//   },
//   Chiúre: {
//       "Chiure-Sede": '01', 
//       "Chiure Velho": '02', 
//       "Katapua": '03', 
//       "Mazeze": '04', 
//       "Namogelia": '05', 
//       "Ocua": '06',
//   },
//   Namuno: {
//       "Hucula": '01', 
//       "Machoca": '02', 
//       "Meloco": '03', 
//       "Namuno-Sede": '04', 
//       "Ncumpe": '05', 
//       "Papai": '06',
//   },
//   Balama: {
//       "Balama-Sede": '01', 
//       "Impiri": '02', 
//       "Kuekue": '03', 
//       "Mavala": '04',
//   },
//   Pemba: {
//       "Alto Gingone": '01',
//       "Cariaco": '02',
//       "Cimento-Sede": '03',
//       "Chuiba": '04',
//       "Eduardo Mondlane": '05',
//       "Ingonane": '06',
//       "Marringanha": '07',
//       "Muxara": '08',
//       "Natite": '09',
//       "Paquitequete": '10',
//   },
//   Metuge: {
//       "Metuge-Sede": '01', 
//       "Mieze": '02',
//   },
//   Ancuabe: {
//       "Ancuabe-Sede": '01', 
//       "Metoro": '02', 
//       "Mesa": '03',
//   },
//   Quissanga: {
//       "Bilibiza": '01', 
//       "Mahate": '02',
//       "Quissanga-Sede": '03', 
//   },
//   Ibo: {
//       "Ibo-Sede": '01', 
//       "Quirimba": '02',
//   },
//   Meluco: {
//       "Meluco-Sede": '01', 
//       "Muaguide": '02',
//   },
//   Montepuez: {
//       "Mapupulo": '01', 
//       "Mirate": '02', 
//       "Montepuez-Sede": '03', 
//       "Nairoto": '04', 
//       "Namanhumir": '05',
//   },
//   Macomia: {
//       "Chai": '01', 
//       "Macomia-Sede": '02', 
//       "Mucojo": '03', 
//       "Quiterajo": '04',
//   },
//   Muidumbe: {
//       "Chitunda": '01', 
//       "Miteda": '02',
//       "Muidumbe-Sede": '03', 
//   },
//   "Mocímboa da Praia": {
//       "Diaca": '01', 
//       "Mbau": '02',
//       "Mocimboa da Praia-Sede": '03', 
//   },
//   Mueda: {
//       "Chapa": '01', 
//       "Imbuo": '02', 
//       "Mueda-Sede": '03', 
//       "Negomano": '04', 
//       "N'gapa": '05',
//   },
//   Palma: {
//       "Olumbi": '01', 
//       "Palma-Sede": '02', 
//       "Pundanhar": '03', 
//       "Quionga": '04',
//   },
//   Nangade: {
//       "Nangade-Sede": '01', 
//       "Ntamba": '02',
//   },

//   // Niassa
//   Cuamba: {
//       "Cuamba-Sede": '01', 
//       "Etatara": '02', 
//       "Lurio": '03',
//     },
//   Mecanhelas: {
//       "Chiuta": '01', 
//       "Insaca-Sede": '02',
//   },
//   Metarica: {
//       "Metarica-Sede": '01', 
//       "Mucumua": '02',
//   },
//   Mandimba: {
//       "Mandimba-Sede": '01', 
//       "Mitande": '02',
//   },
//   Nipepe: {
//       "Muipite": '01', 
//       "Nipepe-Sede": '02',
//   },
//   Maúa: {
//       "Maiaca": '01',
//       "Maúa-Sede": '02', 
//   },
//   Marrupa: {
//       "Marangira": '01', 
//       "Murrupa-Sede": '02', 
//       "Nungo": '03',
//   },
//   Majune: {
//       "Malanga-Sede": '01', 
//       "Muaquia": '02', 
//       "Nairubi": '03',
//   },
//   "N'gauma": {
//       "Itepela": '01', 
//       "Massangulo-Sede": '02',
//   },
//   Chimbunila: {
//       "Chimbunila-Sede": '01', 
//       "Lione": '02',
//   },
//   Lichinga: {
//       "Lichinga-Sede": '01', 
//       "Meponda": '02', 
//   },
//   Mecula: {
//       "Matondovela": '01', 
//       "Mecula-Sede": '02',
//   },
//   Mavago: {
//       "Mavago-Sede": '01',
//       "M'Sawise": '02', 
//   },
//   Muembe: {
//       "Chiconono": '01', 
//       "Muembe-Sede": '02',
//   },
//   Sanga: {
//       "Lussimbesse": '01', 
//       "Macaloge": '02', 
//       "Matchedje": '03', 
//       "Unango-Sede": '04',
//   },
//   Lago: {
//       "Cobue": '01', 
//       "Lunho": '02', 
//       "Maniamba": '03', 
//       "Metangula-Sede": '04',
//   },


  // // Maputo-Cidade
  // KaMpfumu: {
  //   "Alto Maé A": '0101-01',
  //   "Alto Maé B": '0101-02',
  //   "Bairro Central A": '0101-03',
  //   "Bairro Central B": '0101-04',
  //   "Bairro Central C": '0101-05',
  //   "Coop": '0101-06',
  //   "Malhangalene A": '0101-07',
  //   "Malhangalene B": '0101-08',
  //   "Polana Cimento A": '0101-09',
  //   "Polana Cimento B": '0101-10',
  //   "Sommerschield": '0101-11',
  //   },
  
  // Nlhamankulu: {
  //   "Aeroporto A": '0102-01',
  //   "Aeroporto B": '0102-02',
  //   "Chamanculo A": '0102-03',
  //   "Chamanculo B": '0102-04',
  //   "Chamanculo C": '0102-05',
  //   "Chamanculo D": '0102-06',
  //   "Malanga": '0102-07',
  //   "Minkadjuine": '0102-08',
  //   "Munhuana": '0102-09',
  //   "Unidade 7": '0102-10',
  //   "Xipamanine": '0102-11',
  //   },
  
  // KaMaxakeni:{
  //   "Mafalala": '0103-01', 
  //   "Maxaquene A": '0103-02',
  //   "Maxaquene B": '0103-03',
  //   "Maxaquene C": '0103-04', 
  //   "Maxaquene D": '0103-05',
  //   "Polana Caniço A": '0103-06',
  //   "Polana Caniço B": '0103-07', 
  //   "Urbanização": '0103-08'
  // },
  
  // KaMavota: {
  //   "3 de Fevereiro": '0104-01',
  //   "Albazine": '0104-02',
  //   "Costa do Sol": '0104-03',
  //   "F.P.L.M.": '0104-04',
  //   "Ferroviário": '0104-05',
  //   "Hulene A": '0104-06',
  //   "Hulene B": '0104-07',
  //   "Laulane": '0104-08',
  //   "Mahotas": '0104-09',
  //   "Mavalane A": '0104-10',
  //   "Mavalane B": '0104-11',
  // },
  
  //   KaMubukwana: {
  //   "25 de Junho A": '0105-01',
  //   "25 de Junho B": '0105-02',
  //   "Bagamoyo": '0105-03',
  //   "Inhagóia A": '0105-04',
  //   "Inhagóia B": '0105-05',
  //   "Jardim": '0105-06',
  //   "George Dimitrov": '0105-07',
  //   "Luis Cabral": '0105-08',
  //   "Magoanine A": '0105-09',
  //   "Magoanine B": '0105-10',
  //   "Magoanine C": '0105-11',
  //   "Malhazine": '0105-12',
  //   "Nsalene": '0105-13',
  //   "Zimpeto": '0105-14',
  //   },
  
  //   KaTembe: {
  //       "Chali": '0106-01', 
  //       "Chamissava": '0106-02',
  //       "Guachene": '0106-03', 
  //       "Incassane": '0106-04', 
  //       "Inguide": '0106-05', 
  //   },
  //   KaNyaka: {
  //       "Inguane": '0107-01', 
  //       "Nhaquene": '0107-02',
  //       "Ridzene": '0107-01', 
  //   },
  
  
  //   // Maputo
  //   Matutuíne: {
  //       "Bela-Vista-Sede": '0201-01',
  //       "Catembe Nsime": '0201-02', 
  //       "Catuane": '0201-03', 
  //       "Machangulo": '0201-04', 
  //       "Zitundo": '0201-05'
  //       // "Missevene": , 
  //   },
  
  //   Namaacha: {
  //       "Changalane": '0202-01',
  //       "Namaacha-Sede": '0202-02', 
  //   },
  //   Boane: {
  //       "Boane-Sede": '0203-01', 
  //       "Matola-Rio": '0203-02',
  //   },
  //   Matola: {
  //       "Infulene": '0204-01', 
  //       "Machava": '0204-02',
  //       "Matola-Sede": '0204-03', 
  //   },
  //   Marracuene: {
  //       "Machubo": '0205-01',
  //       "Marracuene-Sede": '0205-02', 
  //   },
  //   Moamba: {
  //       "Moamba-Sede": '0205-01', 
  //       "Pessene": '0205-02', 
  //       "Ressano Garcia": '0205-03', 
  //       "Sabie": '0205-04'
  //   },
  //   Manhiça: {
  //       "3 de Fevereiro": '0207-01',
  //       "Calanga": '0207-02',
  //       "Ilha Josina Machel": '0207-03',
  //       "Maluana": '0207-04',
  //       "Manhiça-Sede": '0207-05',
  //       "Xinavane": '0207-06',
  //   },
  //   Magude: {
  //       "Magude-Sede": '0208-01', 
  //       "Mahele": '0208-02', 
  //       "Mapulanguene": '0208-03', 
  //       "Motaze": '0208-04', 
  //       "Panjane": '0208-05',
  //   },
  
  
  //   // Gaza
  //   Chongoene: {
  //       "Chongoene-Sede": '0301-01', 
  //       "Mazucane": '0301-02', 
  //       "Nguzene": '0301-03',
  //   },
  //   "Xai-Xai": {
  //       "Inhamissa": '0302-01',
  //       "Patrice Lumumba": '0302-02',
  //       "Praia de Xai-Xai": '0302-03',
  //       "Xai-Xai-Sede": '0302-04',
  //   },
  //   Limpopo: {
  //       "Chicumbane-Sede": '0303-01', 
  //       "Chissano": '0303-02', 
  //       "Zongoene": '0303-03'
  //   },
  //   Bilene: {
  //       "Incaia": '0304-01',
  //       "Macia-Sede": '0304-02',
  //       "Macuane": '0304-03',
  //       "Mazivala": '0304-04',
  //       "Messano": '0304-05',
  //       "Praia do Bilene": '0304-06',
  //   },
  
  //   Mandlakazi: {
  //       "Chibonzane": '0305-01',
  //       "Chidenguele": '0305-02',
  //       "Macuacua": '0305-03',
  //       "Mandlakazi-Sede": '0305-04',
  //       "Xalala": '0305-05',
  //   },
  //   Chibuto: {
  //       "Alto Changane": '0306-01',
  //       "Chaimite": '0306-02',
  //       "Changanine": '0306-03',
  //       "Chibuto-Sede": '0306-04',
  //       "Godide": '0306-05',
  //       "Malehice": '0306-06',
  //   },
  //   Chókwè: {
  //       "Chókwè-Sede": '0307-01', 
  //       "Lionde": '0307-02', 
  //       "Macarretane": '0307-03', 
  //       "Xilembene": '0307-04',
  //   },
  //   Guijá: {
  //       "Caniçado-Sede": '0308-01', 
  //       "Chivongoene": '0308-02', 
  //       "Mubangoene": '0308-03', 
  //       "Nalazi": '0308-04',
  //   },
  //   Chigubo: {
  //       "Chigubo": '0309-01', 
  //       "Dindiza-Sede": '0309-02',
  //   },
  //   Mabalane: {
  //       "Combomune": '0310-01', 
  //       "Mabalane-Sede": '0310-02', 
  //       "Ntlavene": '0310-03',
  //   },
  //   Massingir: {
  //       "Massingir-Sede": '0311-01', 
  //       "Mavodze": '0311-02', 
  //       "Zulo": '0311-03',
  //   },
  //   Mapai: {
  //       "Machaila": '0312-01',
  //       "Mapai-Sede": '0312-02', 
  //   },
  //   Chicualacuala: {
  //       "Eduardo Mondlane-Sede": '0313-01', 
  //       "Pafuri": '0313-02',
  //       // "Mapai", 
  //   },
  //   Massangena: {
  //       "Massangena-Sede": '0314-01', 
  //       "Mavue": '0314-02',
  //   },
  
  //   // Inhambane
  //   Zavala: {
  //       "Quissico-Sede": '0401-01', 
  //       "Zandamela": '0401-02',
  //   },
  //   Inharrime: {
  //       "Inharrime-Sede": '0402-01', 
  //       "Mocumbi": '0402-02',
  //   },
  //   Jangamo: {
  //       "Cumbana": '0403-01',
  //       "Jangamo-Sede": '0403-02', 
  //   },
  //   Inhambane: {
  //       "Balane 1": '0404-01',
  //       "Balane 2": '0404-02',
  //       "Balane 3": '0404-03',
  //       "Chamane": '0404-04',
  //       "Chambale 1": '0404-05',
  //       "Chambale 2": '0404-06',
  //       "Conguiana": '0404-07',
  //       "Guitamatuno": '0404-08',
  //       "Ilha Inhambane": '0404-09',
  //       "Josina Machel": '0404-10',
  //       "Liberdade 1": '0404-11',
  //       "Liberdade 2": '0404-12',
  //       "Liberdade 3": '0404-13',
  //       "Machavenga": '0404-14',
  //       "Malembuane": '0404-15',
  //       "Marrambone": '0404-16',
  //       "Mucucune": '0404-17',
  //       "Muele 1": '0404-18',
  //       "Muele 2": '0404-19',
  //       "Muele 3": '0404-20',
  //       "Inhamua": '0404-21',
  //       "Salele": '0404-22',
  //       "Siquiriva": '0404-23',
  //   },
  //   Maxixe: {
  //       "Bembe": '0405-01',
  //       "Chambone A-Sede": '0405-02',
  //       "Chambone B": '0405-03',
  //       "Dambo": '0405-04',
  //       "Eduardo Mondlane": '0405-05',
  //       "Mabil": '0405-06',
  //       "Macuamene": '0405-07',
  //       "Macupula": '0405-08',
  //       "Malalane": '0405-09',
  //       "Manhala": '0405-10',
  //       "Mawewe": '0405-11',
  //       "Nhabanda": '0405-12',
  //       "Nhaguiviga": '0405-13',
  //       "Nhambui": '0405-14',
  //       "Nhanguila": '0405-15',
  //       "Rumbana": '0405-16',
  //       "Tinga-Tinga": '0405-17'
  //   },
  //   Homoíne: {
  //       "Homoíne-Sede": '0406-01', 
  //       "Pembe": '0406-02',
  //   },
  //   Panda: {
  //       "Mawayela": '0407-01', 
  //       "Panda-Sede": '0407-02', 
  //       "Urrene": '0407-03',
  //   },
  //   Morrumbene: {
  //       "Mocodoene": '0408-01',
  //       "Morrumbene-Sede": '0408-02', 
  //   },
  //   Massinga: {
  //       "Chicomo": '0409-01',
  //       "Massinga-Sede": '0409-02', 
  //   },
  //   Funhalouro: {
  //       "Funhalouro-Sede": '0410-01', 
  //       "Tome": '0410-02',
  //   },
  //   Vilankulo: {
  //       "Mapinhane": '0411-01',
  //       "Vilankulo-Sede": '0411-02', 
  //   },
  //   Mabote: {
  //       "Mabote-Sede": '0412-01', 
  //       "Zimane": '0412-02', 
  //       "Zinave": '0412-03',
  //   },
  //   Inhassoro: {
  //       "Bazaruto": '0413-01',
  //       "Inhassoro-Sede": '0413-02', 
  //   },
  //   Govuro: {
  //       "Mambone-Sede": '0414-01', 
  //       "Save": '0414-02',
  //   },
  
  
  //   // Sofala
  //   Machanga: {
  //       "Divinhe": '0501-01', 
  //       "Machanga-Sede": '0501-01',
  //   },
  //   Búzi: {
  //       "Búzi-Sede": '0502-01', 
  //       "Estaquinha": '0502-02', 
  //       "Sofala": '0502-03'
  //   },
  //   Chibabava: {
  //       "Chibabava-Sede": '0503-01', 
  //       "Goonda": '0503-02', 
  //       "Muxungue": '0503-03'
  //   },
  //   Beira: {
  //       "Chiveve-Sede": '0504-01',
  //       "Manga Loforte": '0504-02', 
  //       "Munhava": '0504-03', 
  //       "Nhamizua": '0504-04', 
  //       "Nhangau": '0504-05',
  //   },
  //   Dondo: {
  //       "Dondo-Sede": '0505-01', 
  //       "Mafambisse": '0505-02',
  //   },
  //   Nhamatanda: {
  //       "Nhamatanda-Sede": '0506-01', 
  //       "Tica": '0506-02',
  //   },
  //   Muanza: {
  //       "Galinha": '0507-01', 
  //       "Muanza-Sede": '0507-02'
  //   },
  //   Gorongosa: {
  //       "Gorongosa-Sede": '0508-01', 
  //       "Nhamadze": '0508-02', 
  //       "Vanduzi": '0508-03',
  //   },
  //   Marromeu: {
  //       "Chupanga": '0509-01', 
  //       "Marromeu-Sede": '0509-02',
  //   },
  //   Cheringoma: {
  //       "Inhaminga-Sede": '0510-01', 
  //       "Inhamitanga": '0510-02',
  //   },
  //   Caia: {
  //       "Caia-Sede": '0511-01', 
  //       "Murraça": '0511-02', 
  //       "Sena": '0511-03',
  //   },
  //   Maringué: {
  //       "Canxixe": '0512-01', 
  //       "Maringué-Sede": '0512-02', 
  //       "Subwe": '0512-03',
  //   },
  //   Chemba: {
  //       "Chemba-Sede": '0513-01', 
  //       "Chiramba": '0513-02', 
  //       "Mulima": '0513-03',
  //   },
  
  //   // Manica
  //   Machaze: {
  //       "Chibote-Sede": '0601-01', 
  //       "Save": '0601-02'
  //   },
  //   Mossurize: {
  //       "Chiurairue": '0602-01', 
  //       "Dacata": '0602-02',
  //       "Espungabera-Sede": '0602-03', 
  //   },
  //   Sussundenga: {
  //       "Dombe": '0603-01', 
  //       "Muoha": '0603-02', 
  //       "Rotanda": '0603-03',
  //       "Sussundenga-Sede": '0603-04', 
  //   },
  //   Macate: {
  //       "Macate-Sede": '0604-01', 
  //       "Zembe": '0604-02',
  //   },
  //   Gondola: {
  //       "Amatongas": '0605-01', 
  //       "Cafumpe": '0605-02', 
  //       "Gondola-Sede": '0605-03', 
  //       "Inchope": '0605-04',
  //   },
  //   Chimoio: {
  //       "Posto Admin. 1-Sede": '0606-01',
  //       "Posto Admin. 2": '0606-02',
  //       "Posto Admin. 3": '0606-03',
  //       "Posto Admin. 4": '0606-04',
  //   },
  //   Vanduzi: {
  //       "Matsinho": '0607-01',
  //       "Vanduzi-Sede": '0607-02',
  //   },
  //   Manica: {
  //       "Manica-Sede": '0608-01', 
  //       "Machipanda": '0608-02', 
  //       "Mavonde": '0608-03',
  //       "Messica": '0608-04', 
  //   },
  //   Macossa: {
  //       "Macossa-Sede": '0609-01', 
  //       "Nguawala": '0609-02',
  //       "Nhamagua": '0609-03',
  //   },
  //   Bárue: {
  //       "Catandica-Sede": '0610-01', 
  //       "Choa": '0610-02', 
  //       "Nhampassa": '0610-03',
  //   },
  //   Tambara: {
  //       "Buzua": '0611-01', 
  //       "Nhacafula": '0611-02',
  //       "Nhacolo-Sede": '0611-03', 
  //   },
  //   Guro: {
  //       "Guro-Sede": '0612-01', 
  //       "Mandie": '0612-02', 
  //       "Mungari": '0612-03', 
  //       "Nhamassonge": '0612-04',
  //   },
  
  //   // Tete
  //   Mutarara: {
  //       "Chare": '0701-01', 
  //       "Inhangoma": '0701-02', 
  //       "Nhamayabué-Sede": '0701-03', 
  //   },
  //   Dôa: {
  //       "Chueza": '0702-01', 
  //       "Dôa-Sede": '0702-02',
  //   },
  //   Changara: {
  //       "Chioco": '0703-01', 
  //       "Luenha-Sede": '0703-02',
  //   },
  //   Moatize: {
  //       "Kambulatsitsi": '0704-01', 
  //       "Moatize-Sede": '0704-02', 
  //       "Zobue": '0704-03',
  //   },
  //   Tete: {
  //       "Chingodzi": '0705-01',
  //       "Degue": '0705-02',
  //       "Filipe Samuel Magaia": '0705-03',
  //       "Francisco Manyanga": '0705-04',
  //       "Josina Machel": '0705-05',
  //       "Mateus Sansão Muthemba": '0705-06',
  //       "Matundo": '0705-07',
  //       "Mpádué": '0705-08',
  //       "Samora Machel": '0705-09',
  //   },
  //   Marara: {
  //       "Marara-Sede": '0706-01', 
  //       "Mufa-Boroma": '0706-02',
  //   },
  //   "Cahora-Bassa": {
  //       "Chintholo": '0707-01', 
  //       "Chitima-Sede": '0707-02', 
  //       "Songo": '0707-03',
  //   },
  //   Magoé: {
  //       "Chinthopo": '0708-01', 
  //       "Mphende-Sede": '0708-02', 
  //       "Mukumbura": '0708-03',
  //   },
  //   Tsangano: {
  //       "Ntengo-Wa-Mbalame": '0709-01', 
  //       "Tsangano-Sede": '0709-02',
  //   },
  //   Chiuta: {
  //       "Kazula": '0711-01', 
  //       "Manje-Sede": '0711-02',
  //   },
  //   Marávia: {
  //       "Chipera": '0711-01',
  //       "Chiputu": '0711-02', 
  //       "Fingoe-Sede": '0711-03', 
  //       "Malowera": '0711-04', 
  //   },
  //   Zumbo: {
  //       "Muze": '0712-01', 
  //       "Zambue": '0712-02', 
  //       "Zumbo-Sede": '0712-03',
  //   },
  //   Angónia: {
  //       "Domue": '0713-01', 
  //       "Ulongoe-Sede": '0713-02',
  //   },
  //   Macanga: {
  //       "Chidzolomondo": '0714-01', 
  //       "Furancungo-Sede": '0714-02',
  //   },
  //   Chifunde: {
  //       "Chifunde-Sede": '0715-01', 
  //       "Mualadzi": '0715-02', 
  //       "N'Sadzu": '0715-03',
  //   },

// }



