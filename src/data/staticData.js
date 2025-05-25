// Static data for states, districts, cities, service categories, service names, experience levels, and price units

// Southern states of India
export const states = [
  { label: 'Tamil Nadu', value: 'Tamil Nadu' },
  { label: 'Kerala', value: 'Kerala' },
  { label: 'Karnataka', value: 'Karnataka' },
  { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
  { label: 'Telangana', value: 'Telangana' },
  { label: 'Puducherry', value: 'Puducherry' },
];

// Districts for southern states, including all Tamil Nadu districts
export const districts = [
  // Tamil Nadu Districts (38 districts as of 2025)
  { label: 'Ariyalur', value: 'Ariyalur', state: 'Tamil Nadu' },
  { label: 'Chengalpattu', value: 'Chengalpattu', state: 'Tamil Nadu' },
  { label: 'Chennai', value: 'Chennai', state: 'Tamil Nadu' },
  { label: 'Coimbatore', value: 'Coimbatore', state: 'Tamil Nadu' },
  { label: 'Cuddalore', value: 'Cuddalore', state: 'Tamil Nadu' },
  { label: 'Dharmapuri', value: 'Dharmapuri', state: 'Tamil Nadu' },
  { label: 'Dindigul', value: 'Dindigul', state: 'Tamil Nadu' },
  { label: 'Erode', value: 'Erode', state: 'Tamil Nadu' },
  { label: 'Kallakurichi', value: 'Kallakurichi', state: 'Tamil Nadu' },
  { label: 'Kancheepuram', value: 'Kancheepuram', state: 'Tamil Nadu' },
  { label: 'Kanyakumari', value: 'Kanyakumari', state: 'Tamil Nadu' },
  { label: 'Karur', value: 'Karur', state: 'Tamil Nadu' },
  { label: 'Krishnagiri', value: 'Krishnagiri', state: 'Tamil Nadu' },
  { label: 'Madurai', value: 'Madurai', state: 'Tamil Nadu' },
  { label: 'Mayiladuthurai', value: 'Mayiladuthurai', state: 'Tamil Nadu' },
  { label: 'Nagapattinam', value: 'Nagapattinam', state: 'Tamil Nadu' },
  { label: 'Namakkal', value: 'Namakkal', state: 'Tamil Nadu' },
  { label: 'Nilgiris', value: 'Nilgiris', state: 'Tamil Nadu' },
  { label: 'Perambalur', value: 'Perambalur', state: 'Tamil Nadu' },
  { label: 'Pudukkottai', value: 'Pudukkottai', state: 'Tamil Nadu' },
  { label: 'Ramanathapuram', value: 'Ramanathapuram', state: 'Tamil Nadu' },
  { label: 'Ranipet', value: 'Ranipet', state: 'Tamil Nadu' },
  { label: 'Salem', value: 'Salem', state: 'Tamil Nadu' },
  { label: 'Sivaganga', value: 'Sivaganga', state: 'Tamil Nadu' },
  { label: 'Tenkasi', value: 'Tenkasi', state: 'Tamil Nadu' },
  { label: 'Thanjavur', value: 'Thanjavur', state: 'Tamil Nadu' },
  { label: 'Theni', value: 'Theni', state: 'Tamil Nadu' },
  { label: 'Thoothukudi', value: 'Thoothukudi', state: 'Tamil Nadu' },
  { label: 'Tiruchirappalli', value: 'Tiruchirappalli', state: 'Tamil Nadu' },
  { label: 'Tirunelveli', value: 'Tirunelveli', state: 'Tamil Nadu' },
  { label: 'Tirupathur', value: 'Tirupathur', state: 'Tamil Nadu' },
  { label: 'Tiruppur', value: 'Tiruppur', state: 'Tamil Nadu' },
  { label: 'Tiruvallur', value: 'Tiruvallur', state: 'Tamil Nadu' },
  { label: 'Tiruvannamalai', value: 'Tiruvannamalai', state: 'Tamil Nadu' },
  { label: 'Tiruvarur', value: 'Tiruvarur', state: 'Tamil Nadu' },
  { label: 'Vellore', value: 'Vellore', state: 'Tamil Nadu' },
  { label: 'Viluppuram', value: 'Viluppuram', state: 'Tamil Nadu' },
  { label: 'Virudhunagar', value: 'Virudhunagar', state: 'Tamil Nadu' },
  // Kerala Districts (14 districts)
  { label: 'Alappuzha', value: 'Alappuzha', state: 'Kerala' },
  { label: 'Ernakulam', value: 'Ernakulam', state: 'Kerala' },
  { label: 'Idukki', value: 'Idukki', state: 'Kerala' },
  { label: 'Kannur', value: 'Kannur', state: 'Kerala' },
  { label: 'Kasaragod', value: 'Kasaragod', state: 'Kerala' },
  { label: 'Kollam', value: 'Kollam', state: 'Kerala' },
  { label: 'Kottayam', value: 'Kottayam', state: 'Kerala' },
  { label: 'Kozhikode', value: 'Kozhikode', state: 'Kerala' },
  { label: 'Malappuram', value: 'Malappuram', state: 'Kerala' },
  { label: 'Palakkad', value: 'Palakkad', state: 'Kerala' },
  { label: 'Pathanamthitta', value: 'Pathanamthitta', state: 'Kerala' },
  { label: 'Thiruvananthapuram', value: 'Thiruvananthapuram', state: 'Kerala' },
  { label: 'Thrissur', value: 'Thrissur', state: 'Kerala' },
  { label: 'Wayanad', value: 'Wayanad', state: 'Kerala' },
  // Karnataka Districts (sample of 4)
  { label: 'Bangalore Urban', value: 'Bangalore Urban', state: 'Karnataka' },
  { label: 'Mysore', value: 'Mysore', state: 'Karnataka' },
  { label: 'Belagavi', value: 'Belagavi', state: 'Karnataka' },
  { label: 'Hubli-Dharwad', value: 'Hubli-Dharwad', state: 'Karnataka' },
  // Andhra Pradesh Districts (sample of 3)
  { label: 'Visakhapatnam', value: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { label: 'Vijayawada', value: 'Vijayawada', state: 'Andhra Pradesh' },
  { label: 'Guntur', value: 'Guntur', state: 'Andhra Pradesh' },
  // Telangana Districts (sample of 3)
  { label: 'Hyderabad', value: 'Hyderabad', state: 'Telangana' },
  { label: 'Warangal', value: 'Warangal', state: 'Telangana' },
  { label: 'Rangareddy', value: 'Rangareddy', state: 'Telangana' },
  // Puducherry Districts (4 districts)
  { label: 'Puducherry', value: 'Puducherry', state: 'Puducherry' },
  { label: 'Karaikal', value: 'Karaikal', state: 'Puducherry' },
  { label: 'Mahe', value: 'Mahe', state: 'Puducherry' },
  { label: 'Yanam', value: 'Yanam', state: 'Puducherry' },
];

// Cities for each district (comprehensive for Tamil Nadu, sample for others)
export const cities = {
  // Tamil Nadu Cities
  Ariyalur: [
    { label: 'Ariyalur', value: 'Ariyalur' },
    { label: 'Jayankondam', value: 'Jayankondam' },
    { label: 'Sendurai', value: 'Sendurai' },
  ],
  Chengalpattu: [
    { label: 'Chengalpattu', value: 'Chengalpattu' },
    { label: 'Madurantakam', value: 'Madurantakam' },
    { label: 'Cheyyur', value: 'Cheyyur' },
  ],
  Chennai: [
    { label: 'Chennai', value: 'Chennai' },
    { label: 'Tambaram', value: 'Tambaram' },
    { label: 'Avadi', value: 'Avadi' },
    { label: 'Ambattur', value: 'Ambattur' },
  ],
  // Coimbatore District (expanded with 10 more places)
  Coimbatore: [
    { label: 'Coimbatore', value: 'Coimbatore' },
    { label: 'Mettupalayam', value: 'Mettupalayam' },
    { label: 'Pollachi', value: 'Pollachi' },
    { label: 'Karumathapatti', value: 'Karumathapatti' },
    { label: 'kaniyur', value: 'kaniyur' },
    { label: 'Arasur', value: 'Arasur' },
    { label: 'Neelambur', value: 'Neelambur' },
    { label: 'Irugur', value: 'Irugur' },
    { label: 'Sulur', value: 'Sulur' },
    { label: 'Annur', value: 'Annur' },
    { label: 'Valparai', value: 'Valparai' },
    { label: 'Thondamuthur', value: 'Thondamuthur' },
    { label: 'Singanallur', value: 'Singanallur' },
    { label: 'Kinathukadavu', value: 'Kinathukadavu' },
    { label: 'Periyanaickenpalayam', value: 'Periyanaickenpalayam' },
    { label: 'Karamadai', value: 'Karamadai' },
    { label: 'Sirumugai', value: 'Sirumugai' },
    { label: 'Anamalai', value: 'Anamalai' },
    { label: 'Madukkarai', value: 'Madukkarai' },
    { label: 'Saravanampatti', value: 'Saravanampatti' },
    { label: 'Thudiyalur', value: 'Thudiyalur' },
    { label: 'Kavundampalayam', value: 'Kavundampalayam' },
    { label: 'Vellalore', value: 'Vellalore' },
    { label: 'Zamin Uthukuli', value: 'Zamin Uthukuli' },
    // New additions
    
  ],
  Cuddalore: [
    { label: 'Cuddalore', value: 'Cuddalore' },
    { label: 'Chidambaram', value: 'Chidambaram' },
    { label: 'Neyveli', value: 'Neyveli' },
    { label: 'Virudhachalam', value: 'Virudhachalam' },
  ],
  Dharmapuri: [
    { label: 'Dharmapuri', value: 'Dharmapuri' },
    { label: 'Harur', value: 'Harur' },
    { label: 'Pennagaram', value: 'Pennagaram' },
    { label: 'Palacode', value: 'Palacode' },
  ],
  Dindigul: [
    { label: 'Dindigul', value: 'Dindigul' },
    { label: 'Palani', value: 'Palani' },
    { label: 'Oddanchatram', value: 'Oddanchatram' },
    { label: 'Kodaikanal', value: 'Kodaikanal' },
  ],
  Erode: [
    { label: 'Erode', value: 'Erode' },
    { label: 'Gobichettipalayam', value: 'Gobichettipalayam' },
    { label: 'Sathyamangalam', value: 'Sathyamangalam' },
    { label: 'Bhavani', value: 'Bhavani' },
    { label: 'Perundurai', value: 'Perundurai' },
  ],
  Kallakurichi: [
    { label: 'Kallakurichi', value: 'Kallakurichi' },
    { label: 'Ulundurpet', value: 'Ulundurpet' },
    { label: 'Chinnasalem', value: 'Chinnasalem' },
  ],
  Kancheepuram: [
    { label: 'Kancheepuram', value: 'Kancheepuram' },
    { label: 'Sriperumbudur', value: 'Sriperumbudur' },
    { label: 'Uthiramerur', value: 'Uthiramerur' },
  ],
  Kanyakumari: [
    { label: 'Nagercoil', value: 'Nagercoil' },
    { label: 'Kanyakumari', value: 'Kanyakumari' },
    { label: 'Marthandam', value: 'Marthandam' },
  ],
  Karur: [
    { label: 'Karur', value: 'Karur' },
    { label: 'Kulithalai', value: 'Kulithalai' },
    { label: 'Krishnarayapuram', value: 'Krishnarayapuram' },
  ],
  Krishnagiri: [
    { label: 'Krishnagiri', value: 'Krishnagiri' },
    { label: 'Hosur', value: 'Hosur' },
    { label: 'Denkanikottai', value: 'Denkanikottai' },
  ],
  Madurai: [
    { label: 'Madurai', value: 'Madurai' },
    { label: 'Melur', value: 'Melur' },
    { label: 'Thirumangalam', value: 'Thirumangalam' },
    { label: 'Usilampatti', value: 'Usilampatti' },
  ],
  Mayiladuthurai: [
    { label: 'Mayiladuthurai', value: 'Mayiladuthurai' },
    { label: 'Sirkazhi', value: 'Sirkazhi' },
    { label: 'Kuthalam', value: 'Kuthalam' },
  ],
  Nagapattinam: [
    { label: 'Nagapattinam', value: 'Nagapattinam' },
    { label: 'Vedaranyam', value: 'Vedaranyam' },
    { label: 'Kilvelur', value: 'Kilvelur' },
  ],
  Namakkal: [
    { label: 'Namakkal', value: 'Namakkal' },
    { label: 'Tiruchengode', value: 'Tiruchengode' },
    { label: 'Rasipuram', value: 'Rasipuram' },
    { label: 'Paramathi Velur', value: 'Paramathi Velur' },
  ],
  Nilgiris: [
    { label: 'Udhagamandalam', value: 'Udhagamandalam' },
    { label: 'Coonoor', value: 'Coonoor' },
    { label: 'Gudalur', value: 'Gudalur' },
    { label: 'Kotagiri', value: 'Kotagiri' },
  ],
  Perambalur: [
    { label: 'Perambalur', value: 'Perambalur' },
    { label: 'Kunnam', value: 'Kunnam' },
    { label: 'Veppanthattai', value: 'Veppanthattai' },
  ],
  Pudukkottai: [
    { label: 'Pudukkottai', value: 'Pudukkottai' },
    { label: 'Aranthangi', value: 'Aranthangi' },
    { label: 'Alangudi', value: 'Alangudi' },
  ],
  Ramanathapuram: [
    { label: 'Ramanathapuram', value: 'Ramanathapuram' },
    { label: 'Rameswaram', value: 'Rameswaram' },
    { label: 'Paramakudi', value: 'Paramakudi' },
  ],
  Ranipet: [
    { label: 'Ranipet', value: 'Ranipet' },
    { label: 'Arakkonam', value: 'Arakkonam' },
    { label: 'Walajapet', value: 'Walajapet' },
  ],
  Salem: [
    { label: 'Salem', value: 'Salem' },
    { label: 'Attur', value: 'Attur' },
    { label: 'Mettur', value: 'Mettur' },
    { label: 'Omalur', value: 'Omalur' },
    { label: 'Sankari', value: 'Sankari' },
  ],
  Sivaganga: [
    { label: 'Sivaganga', value: 'Sivaganga' },
    { label: 'Karaikudi', value: 'Karaikudi' },
    { label: 'Devakottai', value: 'Devakottai' },
  ],
  Tenkasi: [
    { label: 'Tenkasi', value: 'Tenkasi' },
    { label: 'Sankarankovil', value: 'Sankarankovil' },
    { label: 'Kadayanallur', value: 'Kadayanallur' },
  ],
  Thanjavur: [
    { label: 'Thanjavur', value: 'Thanjavur' },
    { label: 'Kumbakonam', value: 'Kumbakonam' },
    { label: 'Pattukkottai', value: 'Pattukkottai' },
  ],
  Theni: [
    { label: 'Theni', value: 'Theni' },
    { label: 'Periyakulam', value: 'Periyakulam' },
    { label: 'Bodinayakanur', value: 'Bodinayakanur' },
    { label: 'Cumbum', value: 'Cumbum' },
  ],
  Thoothukudi: [
    { label: 'Thoothukudi', value: 'Thoothukudi' },
    { label: 'Kovilpatti', value: 'Kovilpatti' },
    { label: 'Tiruchendur', value: 'Tiruchendur' },
  ],
  Tiruchirappalli: [
    { label: 'Tiruchirappalli', value: 'Tiruchirappalli' },
    { label: 'Srirangam', value: 'Srirangam' },
    { label: 'Manapparai', value: 'Manapparai' },
    { label: 'Lalgudi', value: 'Lalgudi' },
  ],
  Tirunelveli: [
    { label: 'Tirunelveli', value: 'Tirunelveli' },
    { label: 'Palayamkottai', value: 'Palayamkottai' },
    { label: 'Ambasamudram', value: 'Ambasamudram' },
  ],
  Tirupathur: [
    { label: 'Tirupathur', value: 'Tirupathur' },
    { label: 'Vaniyambadi', value: 'Vaniyambadi' },
    { label: 'Ambur', value: 'Ambur' },
  ],
  Tiruppur: [
    { label: 'Tiruppur', value: 'Tiruppur' },
    { label: 'Avinashi', value: 'Avinashi' },
    { label: 'Palladam', value: 'Palladam' },
    { label: 'Vanjipalayam', value: 'Vanjipalayam' },
    { label: 'kodathapalayam', value: 'kodathapalayam' },
    { label: 'sempandapalayam', value: 'sempandapalayam' },
    { label: 'Iduvai', value: 'Iduvai' },
    { label: 'poomalur', value: 'poomalur' },
    { label: 'chinnakarai', value: 'chinnakarai' },
    { label: 'Kangeyam', value: 'Kangeyam' },
    { label: 'Velampalayam', value: 'Velampalayam' },
    { label: 'Dharapuram', value: 'Dharapuram' },
    { label: 'Udumalaipettai', value: 'Udumalaipettai' },
    { label: 'Kangeyam', value: 'Kangeyam' },
    { label: 'Velampalayam', value: 'Velampalayam' },
    { label: 'Nallur', value: 'Nallur' },
    { label: 'Uthukuli', value: 'Uthukuli' },
    { label: 'Madathukulam', value: 'Madathukulam' },
    { label: 'Vellakoil', value: 'Vellakoil' },
    { label: 'Moolanur', value: 'Moolanur' },
    { label: 'Thirumuruganpoondi', value: 'Thirumuruganpoondi' },
    { label: 'Chinnakkampalayam', value: 'Chinnakkampalayam' },
    { label: 'Kunnathur', value: 'Kunnathur' },
    { label: 'Perumanallur', value: 'Perumanallur' },
    { label: 'Mangalam', value: 'Mangalam' },
    { label: 'Kundadam', value: 'Kundadam' },
    { label: 'Senneerkuppam', value: 'Senneerkuppam' },
    { label: 'Peelamedu', value: 'Peelamedu' },
    { label: 'Ganapathy', value: 'Ganapathy' },
    { label: 'Vadavalli', value: 'Vadavalli' },
    { label: 'Kovaipudur', value: 'Kovaipudur' },
    { label: 'Neelambur', value: 'Neelambur' },
    { label: 'Kalapatti', value: 'Kalapatti' },
    { label: 'Somayampalayam', value: 'Somayampalayam' },
    { label: 'Chettipalayam', value: 'Chettipalayam' },
    { label: 'Alandurai', value: 'Alandurai' },
    { label: 'Perur', value: 'Perur' },
    { label: 'Velampalayam', value: 'Velampalayam' }, // Note: Already exists, replaced below
    { label: 'Andipalayam', value: 'Andipalayam' },
    { label: 'Muthanampalayam', value: 'Muthanampalayam' },
    { label: 'Veerapandi', value: 'Veerapandi' },
    { label: 'Pongalur', value: 'Pongalur' },
    { label: 'Koduvai', value: 'Koduvai' },
    { label: 'Kolathupalayam', value: 'Kolathupalayam' },
    { label: 'Neruperichal', value: 'Neruperichal' },
    { label: 'Kaniyur', value: 'Kaniyur' },
    { label: 'Thottipalayam', value: 'Thottipalayam' },
    { label: 'Cheyur', value: 'Cheyur' },
  ],
  Tiruvallur: [
    { label: 'Tiruvallur', value: 'Tiruvallur' },
    { label: 'Thiruthani', value: 'Thiruthani' },
    { label: 'Poonamallee', value: 'Poonamallee' },
  ],
  Tiruvannamalai: [
    { label: 'Tiruvannamalai', value: 'Tiruvannamalai' },
    { label: 'Arani', value: 'Arani' },
    { label: 'Cheyyar', value: 'Cheyyar' },
  ],
  Tiruvarur: [
    { label: 'Tiruvarur', value: 'Tiruvarur' },
    { label: 'Mannargudi', value: 'Mannargudi' },
    { label: 'Thiruthuraipoondi', value: 'Thiruthuraipoondi' },
  ],
  Vellore: [
    { label: 'Vellore', value: 'Vellore' },
    { label: 'Gudiyatham', value: 'Gudiyatham' },
    { label: 'Katpadi', value: 'Katpadi' },
  ],
  Viluppuram: [
    { label: 'Viluppuram', value: 'Viluppuram' },
    { label: 'Tindivanam', value: 'Tindivanam' },
    { label: 'Gingee', value: 'Gingee' },
  ],
  Virudhunagar: [
    { label: 'Virudhunagar', value: 'Virudhunagar' },
    { label: 'Sivakasi', value: 'Sivakasi' },
    { label: 'Sattur', value: 'Sattur' },
    { label: 'Rajapalayam', value: 'Rajapalayam' },
  ],
  // Other States (sample cities)
  Alappuzha: [
    { label: 'Alappuzha', value: 'Alappuzha' },
    { label: 'Cherthala', value: 'Cherthala' },
    { label: 'Kayamkulam', value: 'Kayamkulam' },
  ],
  Ernakulam: [
    { label: 'Kochi', value: 'Kochi' },
    { label: 'Aluva', value: 'Aluva' },
    { label: 'Kothamangalam', value: 'Kothamangalam' },
  ],
  Idukki: [
    { label: 'Thodupuzha', value: 'Thodupuzha' },
    { label: 'Munnar', value: 'Munnar' },
    { label: 'Kattappana', value: 'Kattappana' },
  ],
  Kannur: [
    { label: 'Kannur', value: 'Kannur' },
    { label: 'Thalassery', value: 'Thalassery' },
    { label: 'Payyannur', value: 'Payyannur' },
  ],
  Kasaragod: [
    { label: 'Kasaragod', value: 'Kasaragod' },
    { label: 'Kanhangad', value: 'Kanhangad' },
    { label: 'Nileshwaram', value: 'Nileshwaram' },
  ],
  Kollam: [
    { label: 'Kollam', value: 'Kollam' },
    { label: 'Punalur', value: 'Punalur' },
    { label: 'Karunagappally', value: 'Karunagappally' },
  ],
  Kottayam: [
    { label: 'Kottayam', value: 'Kottayam' },
    { label: 'Changanassery', value: 'Changanassery' },
    { label: 'Vaikom', value: 'Vaikom' },
  ],
  Kozhikode: [
    { label: 'Kozhikode', value: 'Kozhikode' },
    { label: 'Vatakara', value: 'Vatakara' },
    { label: 'Koyilandy', value: 'Koyilandy' },
  ],
  Malappuram: [
    { label: 'Malappuram', value: 'Malappuram' },
    { label: 'Manjeri', value: 'Manjeri' },
    { label: 'Tirur', value: 'Tirur' },
  ],
  Palakkad: [
    { label: 'Palakkad', value: 'Palakkad' },
    { label: 'Ottapalam', value: 'Ottapalam' },
    { label: 'Chittur', value: 'Chittur' },
  ],
  Pathanamthitta: [
    { label: 'Pathanamthitta', value: 'Pathanamthitta' },
    { label: 'Adoor', value: 'Adoor' },
    { label: 'Thiruvalla', value: 'Thiruvalla' },
  ],
  Thiruvananthapuram: [
    { label: 'Thiruvananthapuram', value: 'Thiruvananthapuram' },
    { label: 'Neyyattinkara', value: 'Neyyattinkara' },
    { label: 'Nedumangad', value: 'Nedumangad' },
  ],
  Thrissur: [
    { label: 'Thrissur', value: 'Thrissur' },
    { label: 'Chalakudy', value: 'Chalakudy' },
    { label: 'Guruvayur', value: 'Guruvayur' },
  ],
  Wayanad: [
    { label: 'Kalpetta', value: 'Kalpetta' },
    { label: 'Mananthavady', value: 'Mananthavady' },
    { label: 'Sulthan Bathery', value: 'Sulthan Bathery' },
  ],
  BangaloreUrban: [
    { label: 'Bangalore', value: 'Bangalore' },
    { label: 'Yelahanka', value: 'Yelahanka' },
    { label: 'Whitefield', value: 'Whitefield' },
  ],
  Mysore: [
    { label: 'Mysore', value: 'Mysore' },
    { label: 'Hunsur', value: 'Hunsur' },
    { label: 'Nanjangud', value: 'Nanjangud' },
  ],
  Belagavi: [
    { label: 'Belagavi', value: 'Belagavi' },
    { label: 'Gokak', value: 'Gokak' },
    { label: 'Athani', value: 'Athani' },
  ],
  HubliDharwad: [
    { label: 'Hubli', value: 'Hubli' },
    { label: 'Dharwad', value: 'Dharwad' },
    { label: 'Navalgund', value: 'Navalgund' },
  ],
  Visakhapatnam: [
    { label: 'Visakhapatnam', value: 'Visakhapatnam' },
    { label: 'Anakapalle', value: 'Anakapalle' },
    { label: 'Gajuwaka', value: 'Gajuwaka' },
  ],
  Vijayawada: [
    { label: 'Vijayawada', value: 'Vijayawada' },
    { label: 'Machilipatnam', value: 'Machilipatnam' },
    { label: 'Gudivada', value: 'Gudivada' },
  ],
  Guntur: [
    { label: 'Guntur', value: 'Guntur' },
    { label: 'Tenali', value: 'Tenali' },
    { label: 'Narasaraopet', value: 'Narasaraopet' },
  ],
  Hyderabad: [
    { label: 'Hyderabad', value: 'Hyderabad' },
    { label: 'Secunderabad', value: 'Secunderabad' },
    { label: 'Kukatpally', value: 'Kukatpally' },
  ],
  Warangal: [
    { label: 'Warangal', value: 'Warangal' },
    { label: 'Hanamkonda', value: 'Hanamkonda' },
    { label: 'Kazipet', value: 'Kazipet' },
  ],
  Rangareddy: [
    { label: 'Shamshabad', value: 'Shamshabad' },
    { label: 'Ibrahimpatnam', value: 'Ibrahimpatnam' },
    { label: 'Vikarabad', value: 'Vikarabad' },
  ],
  Puducherry: [
    { label: 'Puducherry', value: 'Puducherry' },
    { label: 'Oulgaret', value: 'Oulgaret' },
    { label: 'Villianur', value: 'Villianur' },
  ],
  Karaikal: [
    { label: 'Karaikal', value: 'Karaikal' },
    { label: 'Thirunallar', value: 'Thirunallar' },
    { label: 'Nedungadu', value: 'Nedungadu' },
  ],
  Mahe: [
    { label: 'Mahe', value: 'Mahe' },
    { label: 'Palloor', value: 'Palloor' },
    { label: 'Pandakkal', value: 'Pandakkal' },
  ],
  Yanam: [
    { label: 'Yanam', value: 'Yanam' },
    { label: 'Kurasampeta', value: 'Kurasampeta' },
    { label: 'Farampeta', value: 'Farampeta' },
  ],
};

// Service categories 
export const serviceCategories = [
  { label: 'Household Services', value: 'Household Services' },
  { label: 'Mechanics & Vehicle Services', value: 'Mechanics & Vehicle Services' },
  { label: 'Construction & Skilled Labor', value: 'Construction & Skilled Labor' },
  { label: 'Textile & Weaving Industry', value: 'Textile & Weaving Industry' },
  { label: 'Hotel & Catering Services', value: 'Hotel & Catering Services' },
  { label: 'Sales & Retail', value: 'Sales & Retail' },
  { label: 'Medical & Hospital Services', value: 'Medical & Hospital Services' },
  { label: 'Security & Maintenance', value: 'Security & Maintenance' },
  { label: 'Logistics & Delivery', value: 'Logistics & Delivery' },
  { label: 'Beauty & Grooming', value: 'Beauty & Grooming' },
  { label: 'Teaching & Education', value: 'Teaching & Education' },
  { label: 'Banking & Office Jobs', value: 'Banking & Office Jobs' },
  { label: 'Village & Agricultural Workers', value: 'Village & Agricultural Workers' },
];

// Service names by category
export const serviceNames = {
  'Household Services': [
    { label: 'Plumber', value: 'Plumber' },
    { label: 'Electrician', value: 'Electrician' },
    { label: 'Carpenter', value: 'Carpenter' },
    { label: 'AC Service', value: 'AC Service' },
    { label: 'Washing Machine Service', value: 'Washing Machine Service' },
    { label: 'TV Service', value: 'TV Service' },
    { label: 'Painter', value: 'Painter' }, // Changed from 'Painters' for consistency
    { label: 'Gardener', value: 'Gardener' },
    { label: 'Others', value: 'Explore others' },
    
    // Changed from 'Garden Maintainer' for clarity
  ],
  'Mechanics & Vehicle Services': [
    { label: 'Auto Mechanic', value: 'Auto Mechanic' },
    { label: 'Two-Wheeler Mechanic', value: 'Two-Wheeler Mechanic' },
    { label: 'Car Mechanic', value: 'Car Mechanic' },
    { label: 'Lorry/Bus Mechanic', value: 'Lorry/Bus Mechanic' },
    { label: 'Others', value: 'Explore others' },
  ],
  'Construction & Skilled Labor': [
    { label: 'Mason', value: 'Mason' }, // Changed from 'Masons' for consistency
    { label: 'Mason Helper', value: 'Mason Helper' }, // Changed from 'Mason Helpers'
    { label: 'Welder', value: 'Welder' }, // Changed from 'Welders'
    { label: 'Tiles Worker', value: 'Tiles Worker' }, // Changed from 'Tiles Workers'
    { label: 'Lathe Turner', value: 'Lathe Turner' }, // Changed from 'Lathe Turners'
    { label: 'CNC/VMC Operator', value: 'CNC/VMC Operator' }, 
     { label: 'Others', value: 'Explore others' },// Changed from 'CNC/VMC Operators'
  ],
  'Textile & Weaving Industry': [
    { label: 'Power Loom Weaver', value: 'Power Loom Weaver' }, // Changed from 'Power Loom Weavers'
    { label: 'Auto Loom Weaver', value: 'Auto Loom Weaver' }, // Changed from 'Auto Loom Weavers'
    { label: 'Spinning OE Worker', value: 'Spinning OE Worker' }, // Changed from 'Spinning OE Workers'
    { label: 'Garment Worker', value: 'Garment Worker' }, // Changed from 'Garment Workers'
    { label: 'Tailor', value: 'Tailor' }, 
     { label: 'Others', value: 'Explore others' },// Changed from 'Tailors'
  ],
  'Hotel & Catering Services': [
    { label: 'Tea Master', value: 'Tea Master' }, // Clarified from 'Tea Master Suppliers'
    { label: 'Chef', value: 'Chef' }, // Clarified from 'Hotel Master Suppliers'
    { label: 'Waiter', value: 'Waiter' }, 
     { label: 'Others', value: 'Explore others' },// Added for completeness
  ],
  'Sales & Retail': [
    { label: 'Salesperson (Female)', value: 'Salesperson (Female)' }, // Changed from 'Sales Girls/Women'
    { label: 'Salesperson (Male)', value: 'Salesperson (Male)' }, 
     { label: 'Others', value: 'Explore others' },// Changed from 'Sales Men/Boys'
  ],
  'Medical & Hospital Services': [
    { label: 'Lab Technician', value: 'Lab Technician' }, // Changed from 'Lab Technicians'
    { label: 'Hospital Cleaner', value: 'Hospital Cleaner' },
     { label: 'Others', value: 'Explore others' }, // Changed from 'Hospital Cleaners'
  ],
  'Security & Maintenance': [
    { label: 'Security Guard', value: 'Security Guard' }, // Changed from 'Security Guards'
    { label: 'Load Man', value: 'Load Man' }, 
     { label: 'Others', value: 'Explore others' },// Changed from 'Load Men'
  ],
  'Logistics & Delivery': [
    { label: 'Driver', value: 'Driver' }, // Changed from 'Drivers'
    { label: 'Delivery Boy', value: 'Delivery Boy' }, 
     { label: 'Others', value: 'Explore others' },// Changed from 'Delivery Boys'
  ],
  'Beauty & Grooming': [
    { label: "Men's Beautician", value: "Men's Beautician" }, // Changed from 'Men's Beauticians'
    { label: "Women's Beautician", value: "Women's Beautician" }, // Changed from 'Women's Beauticians'
    { label: 'Barber', value: 'Barber' },
     { label: 'Others', value: 'Explore others' }, // Changed from 'Barbers'
  ],
  'Teaching & Education': [
    { label: 'Teacher', value: 'Teacher' }, // Changed from 'Teachers'
    { label: 'Sports Instructor', value: 'Sports Instructor' },
     { label: 'Others', value: 'Explore others' }, // Changed from 'Sports Instructors'
  ],
  'Banking & Office Jobs': [
    { label: 'Bank Staff', value: 'Bank Staff' },
    { label: 'Office Clerk', value: 'Office Clerk' }, 
     { label: 'Others', value: 'Explore others' },// Added for completeness
  ],
  'Village & Agricultural Workers': [
    { label: 'Field Worker', value: 'Field Worker' }, // Changed from 'Village Field Workers'
    { label: 'Farm Laborer', value: 'Farm Laborer' }, 
     { label: 'Others', value: 'Explore others' },// Changed from 'Farm Laborers'
  ],
};

// Experience levels
export const experienceLevels = [
  { label: '0-2 years', value: '0-2' },
  { label: '2-5 years', value: '2-5' },
  { label: '5-8 years', value: '5-8' },
  { label: '8-10 years', value: '8-10' },
  { label: '10+ years', value: '10+' },
];

// Price units
export const priceUnits = [
  { label: 'Per Hour', value: 'per hour' },
  { label: 'Half Day', value: 'half day' },
  { label: 'Full Day', value: 'full day' },
  { label: 'Per Project', value: 'per project' }, // Added for flexibility
];