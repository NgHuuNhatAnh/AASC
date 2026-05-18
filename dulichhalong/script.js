  // use a script tag or an external JS file
 document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(GSDevTools,MorphSVGPlugin,ScrollTrigger)
  // gsap code here!

   

 });

 
 
  (function() {
        // Lấy tất cả các nút chuyển tab
        const tabBtns = document.querySelectorAll('.tab-btn');
        // Lấy tất cả các phần nội dung (schedule, hotel, cars)
        const contents = {
            schedule: document.getElementById('schedule'),
            hotel: document.getElementById('hotel'),
            teambuilding: document.getElementById('teambuilding')
        };

        // Hàm chuyển đổi tab
        function switchTab(tabId) {
            // Ẩn tất cả các tab content
            Object.values(contents).forEach(content => {
                if(content) content.classList.remove('active');
            });
            // Hiển thị tab được chọn
            if(contents[tabId]) {
                contents[tabId].classList.add('active');
            }
            // Cập nhật trạng thái active cho nút bấm
            tabBtns.forEach(btn => {
                const btnTab = btn.getAttribute('data-tab');
                if(btnTab === tabId) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        // Gán sự kiện click cho từng nút
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const tabId = this.getAttribute('data-tab');
                if(tabId && contents[tabId]) {
                    switchTab(tabId);
                }
            });
        });

        // Đảm bảo mặc định hiển thị đúng (lịch trình) nếu có bất đồng
        const activeBtn = document.querySelector('.tab-btn.active');
        if(activeBtn) {
            const defaultTab = activeBtn.getAttribute('data-tab');
            if(defaultTab && contents[defaultTab]) {
                switchTab(defaultTab);
            } else {
                switchTab('hotel');
            }
        } else {
            // fallback
            switchTab('hotel');
        }
    })();




    (function() {
    const searchInput = document.getElementById('tableSearch');
    const clearBtn = document.getElementById('clearSearch');
    const tableBody = document.getElementById('tableBody');
    const resultCountSpan = document.getElementById('searchResultCount');
    
    if (!searchInput || !tableBody) return;
    
    // Lưu lại tất cả các hàng gốc
    let originalRows = [];
    const rows = tableBody.querySelectorAll('tr');
    
    rows.forEach(row => {
        originalRows.push(row);
    });
    
    // Hàm search
    function searchTable() {
        const keyword = searchInput.value.trim().toLowerCase();
        
        if (keyword === '') {
            // Hiện lại tất cả
            originalRows.forEach(row => {
                row.style.display = '';
            });
            if (resultCountSpan) {
                resultCountSpan.textContent = `Hiển thị ${originalRows.length} kết quả`;
            }
            return;
        }
        
        let visibleCount = 0;
        
        originalRows.forEach(row => {
            const text = row.innerText.toLowerCase();
            if (text.includes(keyword)) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        if (resultCountSpan) {
            resultCountSpan.textContent = `Tìm thấy ${visibleCount} kết quả cho "${keyword}"`;
        }
        
        // Hiển thị thông báo không có kết quả
        const existingNoResult = tableBody.querySelector('.no-result-row');
        if (visibleCount === 0 && !existingNoResult) {
            const noResultRow = document.createElement('tr');
            noResultRow.className = 'no-result-row';
            noResultRow.innerHTML = `<td colspan="7" class="no-result">Không tìm thấy kết quả nào cho "${keyword}"</td>`;
            tableBody.appendChild(noResultRow);
        } else if (visibleCount > 0 && existingNoResult) {
            existingNoResult.remove();
        }
    }
    
    // Event listeners
    searchInput.addEventListener('input', searchTable);
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchTable();
            searchInput.focus();
        });
    }
    
    // Khởi tạo
    searchTable();
})();


(function () {
    const wrapper = document.querySelector('.table-wrapper');
    if (!wrapper) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    wrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;
    });

    wrapper.addEventListener('mouseleave', () => { isDown = false; });
    wrapper.addEventListener('mouseup', () => { isDown = false; });

    wrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        const walk = (x - startX) * 1.5;
        wrapper.scrollLeft = scrollLeft - walk;
    });
})();

// ===== BOTTOM SHEET =====
(function () {


    

    const CAR_GUIDES = {
    'HCM-1': { guide: 'Nguyễn Thị Hoàn', phone: '0382073195' },
    'HCM-2': { guide: 'Dương Thanh Chúc', phone: '0344493380' },
    '1':       { guide: 'Nguyễn Thị Giang',  phone: '0983792305' },
    '2':       { guide: 'Đào Đức Uyên',       phone: '0968675610' },
    '3':       { guide: 'Đinh Yên Hà',        phone: '0368661808' },
    '4':       { guide: 'Nguyễn Hồ Công Nhất',phone: '0386348659' },
    '5':       { guide: 'Phạm Hoàng Việt',    phone: '0869940743'},
    '6':       { guide: 'Hán Trung Đức',       phone: '0964967382' },
    '7':       { guide: 'Phạm Thị Huyền',     phone: '0385148268' },
    '8':       { guide: 'Nguyễn Bá Quyền',    phone: '0364511138' },
    '9':       { guide: 'Trịnh Quốc Thắng',   phone: '0327795187' },
};

    let _allPersons = []; // lưu global trong IIFE

    function bindTableRows() {
        _allPersons = getAllPersons(); // cập nhật mỗi lần bind
        _allPersons.forEach((person, i) => {
            person.el.style.cursor = 'pointer';
            person.el.addEventListener('click', () => openSheet(person, _allPersons));
        });
    }

    function openSheetByName(name) {
        const person = _allPersons.find(p => p.name === name);
        if (person) openSheet(person, _allPersons);
    }

    // Parse toàn bộ data từ table
    function getAllPersons() {
        const rows = document.querySelectorAll('#tableBody tr:not(.no-result-row)');
        const persons = [];
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            // if (cells.length < 6) return;
            persons.push({
                name:    cells[0].innerText.trim(),
                room:    cells[1].innerText.trim(),
                gender:  cells[2].innerText.trim(),
                // phone:   cells[3].innerText.trim(),
                unit:    cells[3].innerText.trim(),
                grade:   cells[4].innerText.trim(),
                carNo:   cells[5].innerText.trim(),
                el:      row
            });
        });
        return persons;
    }

   

    function openSheet(person, allPersons) {
    // Highlight row
    document.querySelectorAll('.selected-row').forEach(r => r.classList.remove('selected-row'));
    person.el.classList.add('selected-row');

    // Card 1: Thông tin cá nhân
    document.getElementById('sheetPersonInfo').innerHTML = `
        <div class="info-row"><span class="info-label">Họ tên</span><span class="info-value">${person.name}</span></div>
        <div class="info-row"><span class="info-label">Giới tính</span><span class="info-value">${person.gender}</span></div>
       
        <div class="info-row"><span class="info-label">Đơn vị</span><span class="info-value">${person.unit}</span></div>
        <div class="info-row"><span class="info-label">Hạng phòng</span><span class="info-value">${person.grade}</span></div>
        <div class="info-row"><span class="info-label">Số xe</span><span class="info-value" style="color:#c96f0e">Xe số ${person.carNo}</span></div>
    `;

    // Card 2: Đồng hành trên xe
    const carInfo = CAR_GUIDES[person.carNo] || null;
         const carMates = allPersons.filter(p => p.carNo === person.carNo );
            // document.getElementById('sheetCarInfo').innerHTML = carMates.length
            //     ? carMates.map(p => personChip(p)).join('')
            //     : '<div style="color:#8aa9c4;font-style:italic">Không có ai cùng xe</div>';

            document.getElementById('sheetCarInfo').innerHTML = `
            ${carInfo ? `
                <div class="info-row">
                    <span class="info-label">Hướng dẫn viên</span>
                    <span class="info-value">${carInfo.guide}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Số điện thoại</span>
                    <span class="info-value">
                        <a href="tel:${carInfo.phone}" style="color:#1f4b6e">${carInfo.phone}</a>
                    </span>
                </div>
                
                <hr style="border:none;border-top:1px solid #eef3f8;margin:8px 0">
            ` : ''}
            <div style="font-size:0.78rem;color:#8aa9c4;margin-bottom:6px">Danh sách đồng hành</div>
            ${carMates.length
                ? carMates.map(p => personChip(p)).join('')
                : '<div style="color:#8aa9c4;font-style:italic">Không có ai cùng xe</div>'
            }
        `;

            // Card 3: Bạn cùng phòng
            const roomMates = allPersons.filter(p =>
                 p.room === person.room 
            );
            document.getElementById('sheetRoomInfo').innerHTML = roomMates.length
                ? roomMates.map(p => personChip(p)).join('')
                : '<div style="color:#8aa9c4;font-style:italic">Phòng đơn hoặc chưa xác định</div>';

            // GSAP animation
            const overlay = document.getElementById('personSheet');
            const container = overlay.querySelector('.sheet-container');


            // Tính top = vị trí viewport hiện tại (scrollY) 
            const viewportTop = window.scrollY;
            const remToPx = (rem) => parseFloat(rem) * parseFloat(getComputedStyle(document.documentElement).fontSize);

            const topBotPadding = getComputedStyle(document.documentElement)
                .getPropertyValue('--top-bot-padding')
                .trim(); // "2rem"

            const topBotPaddingpx = remToPx(topBotPadding); // 32px (nếu root font-size = 16px)
            if (viewportTop - topBotPaddingpx <0) {container.style.top = viewportTop + 'px';} 
            else {container.style.top = viewportTop - topBotPaddingpx +"px"; }
            
            setTimeout(() => {
                if (window.innerWidth <= 480) return;
                const card1 = document.querySelector('.sheet-card:nth-child(1)');
                const card3 = document.querySelector('.sheet-card:nth-child(3)');
                const grid = document.querySelector('.sheet-cards');
                const title = document.querySelector('.sheet-card:nth-child(2) .sheet-card-title');
                
                const gap = parseFloat(getComputedStyle(grid).gap);
                const totalHeight = card1.offsetHeight + card3.offsetHeight + gap - title.offsetHeight;
                
                document.querySelector('.sheet-card:nth-child(2) .sheet-card-body').style.maxHeight = totalHeight + 'px';
            }, 0);


            overlay.classList.add('active');
            gsap.killTweensOf([overlay, container]);
            gsap.set(container, { y: '100%' });
            gsap.set(overlay, { opacity: 0 });

            gsap.to(overlay, { opacity: 1, duration: 0.25, ease: 'power2.out' });
            gsap.to(container, { y: '0%', duration: 0.45, ease: 'power4.out' });

            
        }

function closeSheet() {
    const overlay = document.getElementById('personSheet');
    const container = overlay.querySelector('.sheet-container');

    gsap.killTweensOf([overlay, container]);

    gsap.to(container, {
        y: '100%',
        duration: 0.35,
        ease: 'power3.in'
    });

    gsap.to(overlay, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
            overlay.classList.remove('active');
            document.querySelectorAll('.selected-row')
                .forEach(r => r.classList.remove('selected-row'));
        }
    });
}

    // function personChip(p) {
    //     const initials = p.name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();
    //     const femaleClass = p.gender === 'Nữ' ? 'female' : '';
    //     return `
    //         <div class="person-chip">
    //             <div class="person-avatar ${femaleClass}">${initials}</div>
    //             <div>
    //                 <div class="person-name">${p.name}</div>
    //                 <div class="person-unit">${p.unit}</div>
    //             </div>
    //         </div>
    //     `;
    // }

    function personChip(p) {
    const initials = p.name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();
    const femaleClass = p.gender === 'Nữ' ? 'female' : '';
    return `
        <div class="person-chip" style="cursor:pointer" onclick="openSheetByName('${p.name}')">
            <div class="person-avatar ${femaleClass}">${initials}</div>
            <div>
                <div class="person-name">${p.name}</div>
                <div class="person-unit">${p.unit}</div>
            </div>
        </div>
    `;
}

    

    // Gắn click vào từng tr
    // function bindTableRows() {
    //     const allPersons = getAllPersons();
    //     document.querySelectorAll('#tableBody tr:not(.no-result-row)').forEach((row, i) => {
    //         row.style.cursor = 'pointer';
    //         row.addEventListener('click', () => openSheet(allPersons[i], allPersons));
    //     });
    // }

    // Đóng sheet
    document.getElementById('sheetClose').addEventListener('click', closeSheet);
    document.getElementById('personSheet').addEventListener('click', function (e) {
        if (e.target === this) closeSheet();
    });

    // Chờ DOM xong mới bind
    document.addEventListener('DOMContentLoaded', bindTableRows);

    // Rebind sau khi search lọc lại (vì index có thể thay đổi)
    const searchInput = document.getElementById('tableSearch');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            setTimeout(bindTableRows, 100);
        });
    }

    window.openSheetByName = openSheetByName;
})();

