const QURAN_DATA = [
    {
        "id": 1,
        "name": "الفاتحة",
        "pages": [
            1,
            1
        ],
        "actualPages": 1
    },
    {
        "id": 2,
        "name": "البقرة",
        "pages": [
            2,
            49
        ],
        "actualPages": 47
    },
    {
        "id": 3,
        "name": "آل عمران",
        "pages": [
            50,
            76
        ],
        "actualPages": 27
    },
    {
        "id": 4,
        "name": "النساء",
        "pages": [
            77,
            106
        ],
        "actualPages": 29.5
    },
    {
        "id": 5,
        "name": "المائدة",
        "pages": [
            106,
            127
        ],
        "actualPages": 21.5
    },
    {
        "id": 6,
        "name": "الأنعام",
        "pages": [
            128,
            150
        ],
        "actualPages": 23
    },
    {
        "id": 7,
        "name": "الأعراف",
        "pages": [
            151,
            176
        ],
        "actualPages": 26
    },
    {
        "id": 8,
        "name": "الأنفال",
        "pages": [
            177,
            186
        ],
        "actualPages": 10
    },
    {
        "id": 9,
        "name": "التوبة",
        "pages": [
            187,
            207
        ],
        "actualPages": 21
    },
    {
        "id": 10,
        "name": "يونس",
        "pages": [
            208,
            221
        ],
        "actualPages": 13.5
    },
    {
        "id": 11,
        "name": "هود",
        "pages": [
            221,
            235
        ],
        "actualPages": 14
    },
    {
        "id": 12,
        "name": "يوسف",
        "pages": [
            235,
            248
        ],
        "actualPages": 13.5
    },
    {
        "id": 13,
        "name": "الرعد",
        "pages": [
            249,
            255
        ],
        "actualPages": 6
    },
    {
        "id": 14,
        "name": "إبراهيم",
        "pages": [
            255,
            261
        ],
        "actualPages": 7
    },
    {
        "id": 15,
        "name": "الحجر",
        "pages": [
            262,
            267
        ],
        "actualPages": 5.5
    },
    {
        "id": 16,
        "name": "النحل",
        "pages": [
            267,
            281
        ],
        "actualPages": 14.5
    },
    {
        "id": 17,
        "name": "الإسراء",
        "pages": [
            282,
            293
        ],
        "actualPages": 11.5
    },
    {
        "id": 18,
        "name": "الكهف",
        "pages": [
            293,
            304
        ],
        "actualPages": 11.5
    },
    {
        "id": 19,
        "name": "مريم",
        "pages": [
            305,
            312
        ],
        "actualPages": 7
    },
    {
        "id": 20,
        "name": "طه",
        "pages": [
            312,
            321
        ],
        "actualPages": 10
    },
    {
        "id": 21,
        "name": "الأنبياء",
        "pages": [
            322,
            331
        ],
        "actualPages": 10
    },
    {
        "id": 22,
        "name": "الحج",
        "pages": [
            332,
            341
        ],
        "actualPages": 10
    },
    {
        "id": 23,
        "name": "المؤمنون",
        "pages": [
            342,
            349
        ],
        "actualPages": 8
    },
    {
        "id": 24,
        "name": "النور",
        "pages": [
            350,
            359
        ],
        "actualPages": 10
    },
    {
        "id": 25,
        "name": "الفرقان",
        "pages": [
            359,
            366
        ],
        "actualPages": 7
    },
    {
        "id": 26,
        "name": "الشعراء",
        "pages": [
            367,
            376
        ],
        "actualPages": 10
    },
    {
        "id": 27,
        "name": "النمل",
        "pages": [
            377,
            385
        ],
        "actualPages": 8.5
    },
    {
        "id": 28,
        "name": "القصص",
        "pages": [
            385,
            396
        ],
        "actualPages": 11
    },
    {
        "id": 29,
        "name": "العنكبوت",
        "pages": [
            396,
            404
        ],
        "actualPages": 8
    },
    {
        "id": 30,
        "name": "الروم",
        "pages": [
            404,
            410
        ],
        "actualPages": 6.5
    },
    {
        "id": 31,
        "name": "لقمان",
        "pages": [
            411,
            414
        ],
        "actualPages": 4
    },
    {
        "id": 32,
        "name": "السجدة",
        "pages": [
            415,
            417
        ],
        "actualPages": 3
    },
    {
        "id": 33,
        "name": "الأحزاب",
        "pages": [
            418,
            427
        ],
        "actualPages": 10
    },
    {
        "id": 34,
        "name": "سبأ",
        "pages": [
            428,
            434
        ],
        "actualPages": 6.5
    },
    {
        "id": 35,
        "name": "فاطر",
        "pages": [
            434,
            440
        ],
        "actualPages": 6
    },
    {
        "id": 36,
        "name": "يس",
        "pages": [
            440,
            445
        ],
        "actualPages": 5.5
    },
    {
        "id": 37,
        "name": "الصافات",
        "pages": [
            446,
            452
        ],
        "actualPages": 7
    },
    {
        "id": 38,
        "name": "ص",
        "pages": [
            453,
            458
        ],
        "actualPages": 5.5
    },
    {
        "id": 39,
        "name": "الزمر",
        "pages": [
            458,
            467
        ],
        "actualPages": 9
    },
    {
        "id": 40,
        "name": "غافر",
        "pages": [
            467,
            476
        ],
        "actualPages": 9.5
    },
    {
        "id": 41,
        "name": "فصلت",
        "pages": [
            477,
            482
        ],
        "actualPages": 6
    },
    {
        "id": 42,
        "name": "الشورى",
        "pages": [
            483,
            489
        ],
        "actualPages": 6.5
    },
    {
        "id": 43,
        "name": "الزخرف",
        "pages": [
            489,
            495
        ],
        "actualPages": 6.5
    },
    {
        "id": 44,
        "name": "الدخان",
        "pages": [
            496,
            498
        ],
        "actualPages": 3
    },
    {
        "id": 45,
        "name": "الجاثية",
        "pages": [
            499,
            502
        ],
        "actualPages": 3.5
    },
    {
        "id": 46,
        "name": "الأحقاف",
        "pages": [
            502,
            506
        ],
        "actualPages": 4.5
    },
    {
        "id": 47,
        "name": "محمد",
        "pages": [
            507,
            510
        ],
        "actualPages": 4
    },
    {
        "id": 48,
        "name": "الفتح",
        "pages": [
            511,
            515
        ],
        "actualPages": 4.5
    },
    {
        "id": 49,
        "name": "الحجرات",
        "pages": [
            515,
            517
        ],
        "actualPages": 2.5
    },
    {
        "id": 50,
        "name": "ق",
        "pages": [
            518,
            520
        ],
        "actualPages": 2.5
    },
    {
        "id": 51,
        "name": "الذاريات",
        "pages": [
            521,
            523
        ],
        "actualPages": 3
    },
    {
        "id": 52,
        "name": "الطور",
        "pages": [
            523,
            525
        ],
        "actualPages": 2.5
    },
    {
        "id": 53,
        "name": "النجم",
        "pages": [
            526,
            528
        ],
        "actualPages": 2.5
    },
    {
        "id": 54,
        "name": "القمر",
        "pages": [
            528,
            531
        ],
        "actualPages": 3
    },
    {
        "id": 55,
        "name": "الرحمن",
        "pages": [
            531,
            534
        ],
        "actualPages": 3
    },
    {
        "id": 56,
        "name": "الواقعة",
        "pages": [
            534,
            537
        ],
        "actualPages": 3
    },
    {
        "id": 57,
        "name": "الحديد",
        "pages": [
            537,
            541
        ],
        "actualPages": 4
    },
    {
        "id": 58,
        "name": "المجادلة",
        "pages": [
            542,
            545
        ],
        "actualPages": 3.5
    },
    {
        "id": 59,
        "name": "الحشر",
        "pages": [
            545,
            548
        ],
        "actualPages": 3.5
    },
    {
        "id": 60,
        "name": "الممتحنة",
        "pages": [
            549,
            551
        ],
        "actualPages": 2.5
    },
    {
        "id": 61,
        "name": "الصف",
        "pages": [
            551,
            552
        ],
        "actualPages": 1.5
    },
    {
        "id": 62,
        "name": "الجمعة",
        "pages": [
            553,
            554
        ],
        "actualPages": 1.5
    },
    {
        "id": 63,
        "name": "المنافقون",
        "pages": [
            554,
            555
        ],
        "actualPages": 1.5
    },
    {
        "id": 64,
        "name": "التغابن",
        "pages": [
            556,
            557
        ],
        "actualPages": 2
    },
    {
        "id": 65,
        "name": "الطلاق",
        "pages": [
            558,
            559
        ],
        "actualPages": 2
    },
    {
        "id": 66,
        "name": "التحريم",
        "pages": [
            560,
            561
        ],
        "actualPages": 2
    },
    {
        "id": 67,
        "name": "الملك",
        "pages": [
            562,
            564
        ],
        "actualPages": 2.5
    },
    {
        "id": 68,
        "name": "القلم",
        "pages": [
            564,
            566
        ],
        "actualPages": 2
    },
    {
        "id": 69,
        "name": "الحاقة",
        "pages": [
            567,
            568
        ],
        "actualPages": 2
    },
    {
        "id": 70,
        "name": "المعارج",
        "pages": [
            568,
            570
        ],
        "actualPages": 2
    },
    {
        "id": 71,
        "name": "نوح",
        "pages": [
            570,
            571
        ],
        "actualPages": 1.5
    },
    {
        "id": 72,
        "name": "الجن",
        "pages": [
            572,
            573
        ],
        "actualPages": 2
    },
    {
        "id": 73,
        "name": "المزمل",
        "pages": [
            574,
            575
        ],
        "actualPages": 1.5
    },
    {
        "id": 74,
        "name": "المدثر",
        "pages": [
            575,
            577
        ],
        "actualPages": 2
    },
    {
        "id": 75,
        "name": "القيامة",
        "pages": [
            577,
            578
        ],
        "actualPages": 1
    },
    {
        "id": 76,
        "name": "الإنسان",
        "pages": [
            578,
            580
        ],
        "actualPages": 1.5
    },
    {
        "id": 77,
        "name": "المرسلات",
        "pages": [
            580,
            581
        ],
        "actualPages": 1.5
    },
    {
        "id": 78,
        "name": "النبأ",
        "pages": [
            582,
            583
        ],
        "actualPages": 1.5
    },
    {
        "id": 79,
        "name": "النازعات",
        "pages": [
            583,
            584
        ],
        "actualPages": 1.5
    },
    {
        "id": 80,
        "name": "عبس",
        "pages": [
            585,
            585
        ],
        "actualPages": 1
    },
    {
        "id": 81,
        "name": "التكوير",
        "pages": [
            586,
            586
        ],
        "actualPages": 1
    },
    {
        "id": 82,
        "name": "الانفطار",
        "pages": [
            587,
            587
        ],
        "actualPages": 1
    },
    {
        "id": 83,
        "name": "المطففين",
        "pages": [
            587,
            589
        ],
        "actualPages": 1
    },
    {
        "id": 84,
        "name": "الانشقاق",
        "pages": [
            589,
            589
        ],
        "actualPages": 1
    },
    {
        "id": 85,
        "name": "البروج",
        "pages": [
            590,
            590
        ],
        "actualPages": 1
    },
    {
        "id": 86,
        "name": "الطارق",
        "pages": [
            591,
            591
        ],
        "actualPages": 0.5
    },
    {
        "id": 87,
        "name": "الأعلى",
        "pages": [
            591,
            592
        ],
        "actualPages": 0.5
    },
    {
        "id": 88,
        "name": "الغاشية",
        "pages": [
            592,
            592
        ],
        "actualPages": 1
    },
    {
        "id": 89,
        "name": "الفجر",
        "pages": [
            593,
            594
        ],
        "actualPages": 1
    },
    {
        "id": 90,
        "name": "البلد",
        "pages": [
            594,
            594
        ],
        "actualPages": 1
    },
    {
        "id": 91,
        "name": "الشمس",
        "pages": [
            595,
            595
        ],
        "actualPages": 0.5
    },
    {
        "id": 92,
        "name": "الليل",
        "pages": [
            595,
            596
        ],
        "actualPages": 0.5
    },
    {
        "id": 93,
        "name": "الضحى",
        "pages": [
            596,
            596
        ],
        "actualPages": 0.5
    },
    {
        "id": 94,
        "name": "الشرح",
        "pages": [
            596,
            596
        ],
        "actualPages": 0.2
    },
    {
        "id": 95,
        "name": "التين",
        "pages": [
            597,
            597
        ],
        "actualPages": 0.2
    },
    {
        "id": 96,
        "name": "العلق",
        "pages": [
            597,
            598
        ],
        "actualPages": 0.5
    },
    {
        "id": 97,
        "name": "القدر",
        "pages": [
            598,
            598
        ],
        "actualPages": 0.2
    },
    {
        "id": 98,
        "name": "البينة",
        "pages": [
            598,
            599
        ],
        "actualPages": 0.5
    },
    {
        "id": 99,
        "name": "الزلزلة",
        "pages": [
            599,
            599
        ],
        "actualPages": 0.2
    },
    {
        "id": 100,
        "name": "العاديات",
        "pages": [
            599,
            600
        ],
        "actualPages": 0.4
    },
    {
        "id": 101,
        "name": "القارعة",
        "pages": [
            600,
            600
        ],
        "actualPages": 0.4
    },
    {
        "id": 102,
        "name": "التكاثر",
        "pages": [
            600,
            600
        ],
        "actualPages": 0.3
    },
    {
        "id": 103,
        "name": "العصر",
        "pages": [
            601,
            601
        ],
        "actualPages": 0.3
    },
    {
        "id": 104,
        "name": "الهمزة",
        "pages": [
            601,
            601
        ],
        "actualPages": 0.3
    },
    {
        "id": 105,
        "name": "الفيل",
        "pages": [
            601,
            601
        ],
        "actualPages": 0.3
    },
    {
        "id": 106,
        "name": "قريش",
        "pages": [
            602,
            602
        ],
        "actualPages": 0.3
    },
    {
        "id": 107,
        "name": "الماعون",
        "pages": [
            602,
            602
        ],
        "actualPages": 0.3
    },
    {
        "id": 108,
        "name": "الكوثر",
        "pages": [
            602,
            602
        ],
        "actualPages": 0.3
    },
    {
        "id": 109,
        "name": "الكافرون",
        "pages": [
            603,
            603
        ],
        "actualPages": 0.3
    },
    {
        "id": 110,
        "name": "النصر",
        "pages": [
            603,
            603
        ],
        "actualPages": 0.3
    },
    {
        "id": 111,
        "name": "المسد",
        "pages": [
            603,
            603
        ],
        "actualPages": 0.3
    },
    {
        "id": 112,
        "name": "الإخلاص",
        "pages": [
            604,
            604
        ],
        "actualPages": 0.3
    },
    {
        "id": 113,
        "name": "الفلق",
        "pages": [
            604,
            604
        ],
        "actualPages": 0.3
    },
    {
        "id": 114,
        "name": "الناس",
        "pages": [
            604,
            604
        ],
        "actualPages": 0.3
    }
];