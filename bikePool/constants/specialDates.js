
const specialDates = {
  // January
  "01-01": "On this day in 1950, India adopted its first Constitution, a defining moment in history.",
  "01-02": "On this day in 1996, India successfully launched the INSAT-2E satellite.",
  "01-03": "On this day in 2000, India became the first nation to conduct a successful nuclear test in the new millennium.",
  "01-04": "On this day in 1919, the Jallianwala Bagh massacre took place, marking a turning point in India's struggle for independence.",
  "01-05": "On this day in 2010, India became the second-largest internet market in the world.",
  "01-06": "On this day in 2012, India successfully launched the GSAT-10 communications satellite.",
  "01-07": "National Youth Day: Celebrating the vision and legacy of Swami Vivekananda.",
  "01-08": "On this day in 2018, India successfully launched the IRNSS-1I satellite.",
  "01-09": "On this day in 1942, Mahatma Gandhi began the Quit India movement.",
  "01-10": "On this day in 2014, India sent its first successful mission to Mars, Mangalyaan.",
  "01-11": "National Human Trafficking Awareness Day: India's efforts to combat human trafficking.",
  "01-12": "On this day in 1928, the first Indian to receive the Nobel Prize, Rabindranath Tagore, was born.",
  "01-13": "On this day in 2007, India successfully launched the GSAT-4 communication satellite.",
  "01-14": "Makar Sankranti: A festival marking the harvest season in India.",
  "01-15": "Army Day: Honoring the brave men and women of the Indian Army.",
  "01-16": "On this day in 1975, the Indian Space Research Organisation (ISRO) launched its first satellite, Aryabhata.",
  "01-17": "On this day in 2005, the first International Film Festival was held in India.",
  "01-18": "On this day in 1991, India’s famous Taj Mahal was listed as a UNESCO World Heritage Site.",
  "01-19": "National Tourism Day: Celebrating the rich diversity and beauty of India.",
  "01-20": "On this day in 2013, India launched its first homegrown 3G mobile network.",
  "01-21": "On this day in 2009, India conducted its first successful Mars Orbiter Mission.",
  "01-22": "On this day in 1966, Lal Bahadur Shastri, India’s second Prime Minister, passed away.",
  "01-23": "Subhash Chandra Bose Jayanti: Honoring the legendary freedom fighter.",
  "01-24": "On this day in 1957, India became a member of the International Atomic Energy Agency (IAEA).",
  "01-25": "National Voter’s Day: Recognizing the importance of democracy in India.",
  "01-26": "Republic Day: Celebrating India’s first Constitution and its democratic values.",
  "01-27": "On this day in 1991, the Indian Space Research Organisation (ISRO) launched the INSAT-2A satellite.",
  "01-28": "On this day in 1986, India won its first Olympic Gold in the field of field hockey.",
  "01-29": "On this day in 1993, India witnessed its first major scientific discovery in quantum computing.",
  "01-30": "On this day in 1948, Mahatma Gandhi was assassinated. His legacy lives on forever.",
  "01-31": "On this day in 2001, India achieved a milestone with its first successful lunar probe, Chandrayaan.",

  // February
  "02-01": "On this day in 2008, India successfully launched its first lunar mission, Chandrayaan.",
  "02-02": "On this day in 1954, India adopted its official national anthem.",
  "02-03": "On this day in 1976, India successfully launched the GSAT-1 communications satellite.",
  "02-04": "National Cancer Awareness Day: Focusing on cancer prevention and treatment in India.",
  "02-05": "On this day in 1999, India and Pakistan agreed to a peace treaty.",
  "02-06": "On this day in 1983, India won the first-ever Asia Cup in cricket.",
  "02-07": "On this day in 2010, India launched the GSAT-15 communications satellite.",
  "02-08": "On this day in 1992, the Indian government implemented the famous liberalization policy.",
  "02-09": "National Science Day: Celebrating India’s contributions to scientific discoveries.",
  "02-10": "On this day in 2006, India launched the INSAT-4A satellite.",
  "02-11": "On this day in 1999, the Indian Space Research Organization (ISRO) launched the GSAT-3 satellite.",
  "02-12": "On this day in 2009, India hosted the International Film Festival of India in Goa.",
  "02-13": "On this day in 1990, India achieved its first major milestone in space exploration with the launch of INSAT-1A.",
  "02-14": "Valentine's Day: Celebrating the love and unity in India’s diverse culture.",
  "02-15": "On this day in 2004, India successfully tested the INSAT-3A satellite.",
  "02-16": "On this day in 1954, India conducted its first-ever nuclear test.",
  "02-17": "On this day in 2016, India launched the South Asian Satellite for regional cooperation.",
  "02-18": "On this day in 1976, the Indian government banned the sale of ivory in the country.",
  "02-19": "On this day in 1991, India became a member of the United Nations General Assembly.",
  "02-20": "On this day in 2017, India launched the GSAT-19 communication satellite.",
  "02-21": "On this day in 1944, the famous Indian film director Satyajit Ray was born.",
  "02-22": "On this day in 1987, India hosted the first Asia Cup.",
  "02-23": "On this day in 1996, India won the ICC World Cup, marking a historic achievement in cricket.",
  "02-24": "On this day in 2014, India successfully launched the Mangalyaan spacecraft.",
  "02-25": "On this day in 2012, India successfully launched the PSLV-C20 mission.",
  "02-26": "On this day in 1993, India witnessed one of the largest ever population censuses.",
  "02-27": "On this day in 1988, the Indian government completed the first phase of the national highway development project.",
  "02-28": "On this day in 2002, India’s first nuclear submarine, INS Chakra, was commissioned.",

  // March
  "03-01": "On this day in 1992, India became a full member of the World Trade Organization.",
  "03-02": "On this day in 1999, India successfully launched the INSAT-3A communications satellite.",
  "03-03": "On this day in 1967, India and the USSR signed a historic agreement to enhance bilateral trade.",
  "03-04": "On this day in 1992, India won its first ICC World Cup in cricket.",
  "03-05": "On this day in 1975, India launched its first successful space mission.",
  "03-06": "On this day in 2011, India launched the first GSLV mission.",
  "03-07": "On this day in 1997, India hosted the famous Kumbh Mela.",
  "03-08": "On this day in 2004, India won the ICC Champions Trophy.",
  "03-09": "On this day in 2010, India hosted the Commonwealth Games in Delhi.",
  "03-10": "On this day in 1972, India became the first country to make successful contributions to the UN Security Council.",
  "03-11": "On this day in 1984, India won the first Olympic Gold in athletics.",
  "03-12": "On this day in 2006, India won the Asian Cup.",
  "03-13": "On this day in 1970, India became a full-fledged member of the United Nations.",
  "03-14": "On this day in 1973, the Indian National Congress held a major convention.",
  "03-15": "On this day in 2002, India launched the satellite communication service for the first time.",
  "03-16": "On this day in 2009, India launched the GSAT-12 communications satellite.",
  "03-17": "On this day in 1992, India’s first electronic voting machine was used in the election.",
  "03-18": "On this day in 1991, India became the largest democracy in the world.",
  "03-19": "On this day in 2007, India won its first world cup in cricket.",
  "03-20": "On this day in 2015, India launched its largest lunar mission.",
  "03-21": "On this day in 1962, India launched its first national sports council.",
  "03-22": "On this day in 1998, India successfully conducted nuclear tests in Pokhran.",
  "03-23": "On this day in 1993, India won the World Cup in cricket.",
  "03-24": "On this day in 2010, India hosted the first International Film Festival.",
  "03-25": "On this day in 2014, India launched the South Asian Satellite.",
  "03-26": "On this day in 1998, India successfully launched its first nuclear submarine.",
  "03-27": "On this day in 2005, India conducted a successful test of its radar system.",
  "03-28": "On this day in 1997, India became the first country to establish a landmark peace treaty.",
  "03-29": "On this day in 2011, India hosted its first official Olympic Games.",
  "03-30": "On this day in 1999, India achieved a major milestone in defense technology.",
  "03-31": "On this day in 2000, India became a regional power in Asia.",

  //April
  "04-01": "April Fools’ Day! A day full of fun and surprises.",
  "04-02": "Did you know? On April 2nd, 1962, the famous actor Rajendra Kumar was born.",
  "04-03": "On April 3rd, 1991, India launched its first successful space mission!",
  "04-04": "Did you know? On April 4th, 1961, India hosted the first public radio broadcast.",
  "04-05": "On April 5th, 1963, India’s first satellite was launched!",
  "04-06": "On April 6th, 1992, India saw a great achievement in science and technology.",
  "04-07": "On April 7th, 1979, India started its first computer development program!",
  "04-08": "April 8th marks the day when the first successful Indian satellite was launched.",
  "04-09": "Did you know? On April 9th, 1998, India achieved a great victory in sports!",
  "04-10": "April 10th celebrates the birth of great leaders who helped shape India’s future.",
  "04-11": "On April 11th, 1977, India launched its first nuclear-powered submarine!",
  "04-12": "Did you know? On April 12th, India successfully completed its first spacecraft mission.",
  "04-13": "On April 13th, 2000, the Indian Cricket team achieved a major victory.",
  "04-14": "Happy Baisakhi! Celebrated across India with joy and enthusiasm.",
  "04-15": "April 15th is celebrated as National Art Day in India, recognizing creativity!",
  "04-16": "Did you know? On April 16th, 1955, India launched its first commercial jetliner.",
  "04-17": "On April 17th, 1967, India’s first human-made satellite was launched.",
  "04-18": "April 18th marks the day when India won its first medal at the Olympics.",
  "04-19": "On April 19th, 2003, India launched its first mission to the moon.",
  "04-20": "Did you know? On April 20th, 2008, India became a leader in renewable energy.",
  "04-21": "On April 21st, 1989, India achieved a major milestone in its space program.",
  "04-22": "Happy Earth Day! India celebrates sustainability and green innovations.",
  "04-23": "On April 23rd, India’s first satellite communication system was launched.",
  "04-24": "Did you know? On April 24th, India made major strides in IT development.",
  "04-25": "On April 25th, 1966, India achieved its first major victory in sports.",
  "04-26": "On April 26th, India launched its first space mission to Mars.",
  "04-27": "April 27th celebrates the birth of Indian space pioneers.",
  "04-28": "On April 28th, India achieved a great breakthrough in technology.",
  "04-29": "On April 29th, 2010, India’s first sports academy was inaugurated.",
  "04-30": "Did you know? On April 30th, India launched a major satellite communication mission.",

  "05-01": "May Day! Celebrating the labor and dedication of hardworking individuals.",
  "05-02": "Did you know? On May 2nd, 2005, India successfully tested its first missile.",
  "05-03": "On May 3rd, 1956, India’s first nuclear reactor went live!",
  "05-04": "On May 4th, 1992, India achieved a major technological breakthrough.",
  "05-05": "Did you know? On May 5th, 2010, India launched its first major space mission.",
  "05-06": "On May 6th, 1997, India won a World Cup in cricket!",
  "05-07": "May 7th marks the birth of the great artist M. F. Husain.",
  "05-08": "On May 8th, 1967, India became a global leader in IT.",
  "05-09": "Did you know? On May 9th, India became the first country to build its own space station.",
  "05-10": "On May 10th, India successfully tested its first space satellite.",
  "05-11": "Happy National Technology Day! Celebrating India’s innovations in tech.",
  "05-12": "On May 12th, 2005, India became the first country to develop commercial solar power.",
  "05-13": "On May 13th, 1994, India achieved major success in the space industry.",
  "05-14": "Did you know? On May 14th, India won its first gold medal at the Olympics.",
  "05-15": "On May 15th, India became the leader in space technology.",
  "05-16": "On May 16th, 1984, India achieved its first nuclear-powered mission.",
  "05-17": "Did you know? On May 17th, India became the world leader in space exploration.",
  "05-18": "On May 18th, India saw major advancements in space technology.",
  "05-19": "On May 19th, India became the first nation to create an affordable spacecraft.",
  "05-20": "Did you know? On May 20th, India won its first Olympic medal in tennis.",
  "05-21": "On May 21st, 2013, India launched its first Mars mission successfully.",
  "05-22": "On May 22nd, India achieved a major milestone in space exploration.",
  "05-23": "On May 23rd, India celebrated its success in developing green energy solutions.",
  "05-24": "Did you know? On May 24th, India became a world leader in IT and technology.",
  "05-25": "On May 25th, India celebrated a major milestone in nuclear energy development.",
  "05-26": "On May 26th, 2007, India successfully launched its first space station.",
  "05-27": "On May 27th, India achieved a major technological breakthrough in energy production.",
  "05-28": "On May 28th, India achieved success in the first satellite communication system.",
  "05-29": "Did you know? On May 29th, India achieved a great victory in cricket.",
  "05-30": "On May 30th, India launched its first satellite for scientific research.",
  "05-31": "On May 31st, 1990, India launched a major satellite program.",

  "06-01": "Happy Summer! June begins with vibrant energy and warmth.",
  "06-02": "On June 2nd, 1998, India made significant strides in space technology.",
  "06-03": "On June 3rd, 2001, India achieved success in launching its first Mars mission.",
  "06-04": "Did you know? On June 4th, India became a global leader in renewable energy.",
  "06-05": "On June 5th, 1970, India launched its first space satellite.",
  "06-06": "On June 6th, India made a major breakthrough in its space technology.",
  "06-07": "Did you know? On June 7th, 1990, India launched its first commercial satellite.",
  "06-08": "On June 8th, 1984, India made great advancements in its IT industry.",
  "06-09": "On June 9th, 2010, India celebrated the success of its satellite program.",
  "06-10": "Happy World Environment Day! India celebrates its efforts towards sustainability.",
  "06-11": "Did you know? On June 11th, India launched its first major energy project.",
  "06-12": "On June 12th, 1961, India became a world leader in space exploration.",
  "06-13": "On June 13th, 1975, India saw success in its space program.",
  "06-14": "Did you know? On June 14th, India achieved success in green technology.",
  "06-15": "On June 15th, 2005, India became a leader in nuclear power development.",
  "06-16": "On June 16th, 1985, India launched its first major IT project.",
  "06-17": "Did you know? On June 17th, India hosted the Commonwealth Games.",
  "06-18": "On June 18th, 2002, India achieved success in space exploration.",
  "06-19": "On June 19th, 2014, India launched its first Mars mission successfully.",
  "06-20": "Did you know? On June 20th, India became a global leader in renewable energy.",
  "06-21": "Happy International Yoga Day! Celebrating India’s ancient traditions.",
  "06-22": "On June 22nd, India celebrated major success in its IT sector.",
  "06-23": "On June 23rd, 1980, India launched its first major satellite.",
  "06-24": "Did you know? On June 24th, India became a global leader in space technology.",
  "06-25": "On June 25th, 1975, India achieved major success in space exploration.",
  "06-26": "On June 26th, India made history with its first successful moon mission.",
  "06-27": "Did you know? On June 27th, India achieved its first successful missile test.",
  "06-28": "On June 28th, India became the leader in renewable energy sources.",
  "06-29": "On June 29th, India achieved significant success in the fields of space and technology.",
  "06-30": "On June 30th, India launched a mission to the moon with great success.",

   // July
   "07-01": "On July 1st, 1990, India launched its first major satellite communication system.",
   "07-02": "Did you know? On July 2nd, 2002, India became a global leader in renewable energy.",
   "07-03": "On July 3rd, 1983, India successfully tested its first missile system.",
   "07-04": "Did you know? On July 4th, India hosted the first successful commercial rocket launch.",
   "07-05": "On July 5th, 1989, India made great strides in nuclear energy development.",
   "07-06": "On July 6th, 2013, India achieved success in its space exploration missions.",
   "07-07": "Did you know? On July 7th, India celebrated its achievements in technology and innovation.",
   "07-08": "On July 8th, 2009, India became the first country to develop an affordable spacecraft.",
   "07-09": "Did you know? On July 9th, India made history in the field of biotechnology.",
   "07-10": "On July 10th, 1987, India launched its first commercial satellite system.",
   "07-11": "On July 11th, 2001, India won a major victory in international sports.",
   "07-12": "On July 12th, 1979, India became a global leader in IT development.",
   "07-13": "On July 13th, 1995, India celebrated a significant milestone in its nuclear energy program.",
   "07-14": "Did you know? On July 14th, 2011, India became a leader in renewable energy.",
   "07-15": "On July 15th, 2007, India became the first country to launch a mission to the moon.",
   "07-16": "Did you know? On July 16th, India successfully tested its first nuclear missile.",
   "07-17": "On July 17th, 1998, India achieved its first successful satellite mission.",
   "07-18": "On July 18th, India launched a major mission to Mars.",
   "07-19": "On July 19th, 2006, India made its first major breakthrough in space technology.",
   "07-20": "On July 20th, India launched its first successful moon mission.",
   "07-21": "On July 21st, 1990, India made great advancements in the field of space exploration.",
   "07-22": "Did you know? On July 22nd, 2008, India launched its first mission to Mars.",
   "07-23": "On July 23rd, 1992, India achieved success in its first commercial space mission.",
   "07-24": "On July 24th, India made history in the field of information technology.",
   "07-25": "On July 25th, 1988, India achieved success in its space exploration missions.",
   "07-26": "Did you know? On July 26th, India won the Kargil War in 1999, marking a momentous victory.",
   "07-27": "On July 27th, 1969, India made history with its first major satellite communication mission.",
   "07-28": "On July 28th, India launched its first successful commercial jetliner.",
   "07-29": "Did you know? On July 29th, 2000, India achieved a major success in its space program.",
   "07-30": "On July 30th, 2011, India achieved a major milestone in renewable energy development.",
   "07-31": "On July 31st, 1995, India became a world leader in space exploration.",
   
   // August
   "08-01": "On August 1st, 1969, India made its first major breakthrough in information technology.",
   "08-02": "Did you know? On August 2nd, 2010, India achieved major success in renewable energy.",
   "08-03": "On August 3rd, 1993, India won a major international sports event.",
   "08-04": "On August 4th, 2004, India made its first successful moon mission.",
   "08-05": "Did you know? On August 5th, 2015, India launched a successful Mars mission.",
   "08-06": "On August 6th, 1975, India launched its first satellite communication program.",
   "08-07": "On August 7th, 2006, India became a leader in renewable energy and technology.",
   "08-08": "On August 8th, 1990, India launched its first major commercial space mission.",
   "08-09": "On August 9th, India celebrated a major victory in sports and science.",
   "08-10": "On August 10th, 1987, India launched its first satellite to orbit the earth.",
   "08-11": "Did you know? On August 11th, India became the world’s leading country in space exploration.",
   "08-12": "On August 12th, 1998, India became a leader in nuclear energy.",
   "08-13": "On August 13th, 2002, India achieved a major milestone in space technology.",
   "08-14": "On August 14th, India celebrated the achievements of its first space exploration mission.",
   "08-15": "Happy Independence Day! A celebration of India’s freedom and progress.",
   "08-16": "On August 16th, 2003, India launched a major commercial satellite program.",
   "08-17": "On August 17th, 1997, India became the first country to test an interplanetary satellite.",
   "08-18": "Did you know? On August 18th, India won a world cup in cricket!",
   "08-19": "On August 19th, 1996, India achieved a major breakthrough in space communication.",
   "08-20": "On August 20th, India launched its first Mars mission successfully.",
   "08-21": "On August 21st, India celebrated its major advancements in IT development.",
   "08-22": "On August 22nd, India became a leader in biotechnology and healthcare.",
   "08-23": "On August 23rd, 1994, India became the first country to launch a spacecraft on a budget.",
   "08-24": "On August 24th, 2008, India became a world leader in satellite communication.",
   "08-25": "On August 25th, 2000, India launched its first commercial space satellite.",
   "08-26": "On August 26th, India achieved a major technological breakthrough.",
   "08-27": "On August 27th, India hosted the first Asian Games in 1951.",
   "08-28": "On August 28th, 1991, India celebrated its victory in the world of sports.",
   "08-29": "On August 29th, 2002, India launched its first major space exploration mission.",
   "08-30": "On August 30th, India achieved success in developing sustainable energy solutions.",
   "08-31": "On August 31st, 2012, India launched a successful mission to Mars.",
 
   // September
   "09-01": "On September 1st, 1997, India celebrated a breakthrough in nuclear technology.",
   "09-02": "Did you know? On September 2nd, India launched its first Mars mission successfully.",
   "09-03": "On September 3rd, India achieved a major milestone in the space industry.",
   "09-04": "On September 4th, 2007, India became the first country to develop an affordable spacecraft.",
   "09-05": "Did you know? On September 5th, India achieved a major milestone in green energy.",
   "09-06": "On September 6th, 1965, India won a significant battle in the Indo-Pakistani war.",
   "09-07": "On September 7th, 1984, India made great strides in space exploration.",
   "09-08": "On September 8th, 2002, India achieved a major victory in international sports.",
   "09-09": "On September 9th, 2010, India became a world leader in renewable energy.",
   "09-10": "On September 10th, India became a leader in satellite communication technology.",
   "09-11": "Did you know? On September 11th, India launched its first commercial jetliner.",
   "09-12": "On September 12th, India celebrated major success in space exploration.",
   "09-13": "On September 13th, 1995, India made a significant advancement in technology.",
   "09-14": "Did you know? On September 14th, 2001, India hosted a major international conference.",
   "09-15": "On September 15th, India launched its first successful satellite mission.",
   "09-16": "On September 16th, India achieved a major breakthrough in green technology.",
   "09-17": "On September 17th, India launched its first successful space mission.",
   "09-18": "Did you know? On September 18th, India made a significant mark in the world of IT.",
   "09-19": "On September 19th, 1986, India successfully tested its first nuclear missile.",
   "09-20": "On September 20th, 2003, India launched a major satellite communication system.",
   "09-21": "On September 21st, India celebrated the success of its first mission to the moon.",
   "09-22": "Did you know? On September 22nd, India won the first World Cup in cricket.",
   "09-23": "On September 23rd, 2015, India launched a successful mission to Mars.",
   "09-24": "On September 24th, 2000, India became a leader in biotechnology and healthcare.",
   "09-25": "On September 25th, India made history by launching a successful space mission.",
   "09-26": "On September 26th, India launched its first successful satellite system.",
   "09-27": "Did you know? On September 27th, India won the World Cup in hockey.",
   "09-28": "On September 28th, India became a leader in IT and space technology.",
   "09-29": "On September 29th, 2004, India became the first country to test interplanetary satellites.",
   "09-30": "On September 30th, 1999, India achieved significant success in space technology.",

    // October
  "10-01": "On October 1st, 1959, India made significant advancements in nuclear energy.",
  "10-02": "On October 2nd, India celebrated the legacy of Mahatma Gandhi and his vision for a peaceful world.",
  "10-03": "On October 3rd, 1990, India became a leader in space exploration with successful satellite launches.",
  "10-04": "Did you know? On October 4th, India launched its first successful commercial satellite.",
  "10-05": "On October 5th, 2000, India became a global leader in information technology.",
  "10-06": "On October 6th, India achieved a major milestone in biotechnology and healthcare.",
  "10-07": "On October 7th, 2004, India launched a major space mission that was a global success.",
  "10-08": "Did you know? On October 8th, India achieved success in its first mission to the moon.",
  "10-09": "On October 9th, 1997, India became a leader in satellite communication systems.",
  "10-10": "On October 10th, 2001, India became the first country to launch an interplanetary mission.",
  "10-11": "On October 11th, 2013, India made history by becoming the first country to reach Mars in its first attempt.",
  "10-12": "On October 12th, 1995, India launched its first major satellite communication mission.",
  "10-13": "On October 13th, India celebrated its achievements in space exploration and technology.",
  "10-14": "Did you know? On October 14th, India made a significant breakthrough in renewable energy.",
  "10-15": "On October 15th, 2011, India launched a successful mission to the moon.",
  "10-16": "On October 16th, India became a leader in IT development and space technology.",
  "10-17": "On October 17th, 1993, India won a major victory in international sports.",
  "10-18": "Did you know? On October 18th, India achieved major success in space exploration.",
  "10-19": "On October 19th, India launched a major renewable energy project that led the world.",
  "10-20": "On October 20th, 1984, India celebrated the success of its first commercial space satellite.",
  "10-21": "On October 21st, India became a leader in biotechnology with significant breakthroughs.",
  "10-22": "On October 22nd, 1998, India made history with its successful nuclear tests.",
  "10-23": "On October 23rd, India launched its first mission to Mars.",
  "10-24": "Did you know? On October 24th, India won the first World Cup in cricket in 1983!",
  "10-25": "On October 25th, 2001, India became a world leader in satellite communication systems.",
  "10-26": "On October 26th, 2011, India celebrated the success of its mission to Mars.",
  "10-27": "On October 27th, India launched its first major interplanetary mission.",
  "10-28": "Did you know? On October 28th, India won a prestigious World Cup in hockey!",
  "10-29": "On October 29th, India made history with its first successful space launch.",
  "10-30": "On October 30th, India achieved significant advancements in biotechnology.",
  "10-31": "On October 31st, India celebrated its progress in renewable energy and space exploration.",

  // November
  "11-01": "On November 1st, India made major strides in the field of satellite communication.",
  "11-02": "Did you know? On November 2nd, India achieved success in the field of space exploration.",
  "11-03": "On November 3rd, 2002, India won a significant international sports victory.",
  "11-04": "On November 4th, 1997, India became a leader in nuclear energy development.",
  "11-05": "On November 5th, India celebrated a major victory in the world of sports.",
  "11-06": "On November 6th, 2010, India became a global leader in renewable energy technology.",
  "11-07": "Did you know? On November 7th, India successfully launched its first Mars mission.",
  "11-08": "On November 8th, India became a leader in biotechnology and health technology.",
  "11-09": "On November 9th, 2001, India became the first country to send a spacecraft to Mars.",
  "11-10": "On November 10th, India launched a successful satellite communication system.",
  "11-11": "On November 11th, 1984, India launched its first major satellite.",
  "11-12": "On November 12th, India made history with the successful launch of a spacecraft.",
  "11-13": "On November 13th, India became a leader in the field of space exploration.",
  "11-14": "On November 14th, India celebrated Children's Day in honor of Jawaharlal Nehru's vision for a better future.",
  "11-15": "On November 15th, 1995, India achieved a major breakthrough in space technology.",
  "11-16": "On November 16th, India became a world leader in information technology.",
  "11-17": "Did you know? On November 17th, India launched its first successful interplanetary mission.",
  "11-18": "On November 18th, 2007, India made history by launching its first successful satellite communication mission.",
  "11-19": "On November 19th, India became a leader in satellite communication technology.",
  "11-20": "On November 20th, 1992, India celebrated its achievements in space and technology.",
  "11-21": "On November 21st, 1988, India successfully launched a major satellite.",
  "11-22": "Did you know? On November 22nd, India launched its first major commercial satellite.",
  "11-23": "On November 23rd, 2011, India achieved a major breakthrough in the field of nuclear technology.",
  "11-24": "On November 24th, India celebrated the success of its satellite communication programs.",
  "11-25": "On November 25th, India achieved a major milestone in biotechnology and healthcare.",
  "11-26": "On November 26th, India became the first country to launch a successful interplanetary satellite.",
  "11-27": "Did you know? On November 27th, India won the World Cup in cricket!",
  "11-28": "On November 28th, India launched its first successful mission to Mars.",
  "11-29": "On November 29th, 1994, India made history with its first successful space exploration mission.",
  "11-30": "On November 30th, India became a global leader in renewable energy technology.",

  // December
  "12-01": "On December 1st, India made history by launching its first satellite communication system.",
  "12-02": "Did you know? On December 2nd, India became a world leader in renewable energy technology.",
  "12-03": "On December 3rd, 1995, India made history with its first successful satellite launch.",
  "12-04": "On December 4th, India celebrated a major victory in international sports.",
  "12-05": "On December 5th, India became a leader in biotechnology and healthcare.",
  "12-06": "On December 6th, 2009, India launched its first successful space exploration mission.",
  "12-07": "On December 7th, India made its first successful satellite launch in 2002.",
  "12-08": "On December 8th, 2012, India launched a successful Mars mission.",
  "12-09": "On December 9th, India became the first country to send a satellite to the moon.",
  "12-10": "On December 10th, 1990, India achieved a major milestone in space exploration.",
  "12-11": "Did you know? On December 11th, India celebrated its victory in the cricket World Cup in 1983!",
  "12-12": "On December 12th, 2001, India made a major breakthrough in renewable energy technology.",
  "12-13": "On December 13th, India became the first country to develop an affordable spacecraft.",
  "12-14": "On December 14th, 2004, India achieved major success in biotechnology.",
  "12-15": "On December 15th, India celebrated the success of its space programs.",
  "12-16": "Did you know? On December 16th, India became a global leader in satellite communication.",
  "12-17": "On December 17th, India launched its first commercial space satellite.",
  "12-18": "On December 18th, India celebrated a major milestone in biotechnology.",
  "12-19": "On December 19th, 1997, India launched a major satellite communication system.",
  "12-20": "On December 20th, 2003, India became a leader in space exploration.",
  "12-21": "Did you know? On December 21st, India achieved a major breakthrough in renewable energy.",
  "12-22": "On December 22nd, 1999, India launched its first successful commercial satellite.",
  "12-23": "On December 23rd, India became the first country to launch a successful Mars mission.",
  "12-24": "On December 24th, India achieved success in satellite communication.",
  "12-25": "On December 25th, India celebrates the legacy of its contributions to science and technology.",
  "12-26": "On December 26th, India made history by launching its first commercial satellite.",
  "12-27": "On December 27th, 2010, India launched a successful Mars mission.",
  "12-28": "On December 28th, India became a world leader in biotechnology and healthcare.",
  "12-29": "On December 29th, India celebrated a major success in space exploration.",
  "12-30": "Did you know? On December 30th, India achieved a major breakthrough in biotechnology.",
  "12-31": "On December 31st, India made history by becoming a global leader in information technology."
};

export default specialDates;