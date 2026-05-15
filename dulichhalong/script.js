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
            cars: document.getElementById('cars')
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
    // Parse toàn bộ data từ table
    function getAllPersons() {
        const rows = document.querySelectorAll('#tableBody tr:not(.no-result-row)');
        const persons = [];
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 7) return;
            persons.push({
                name:    cells[0].innerText.trim(),
                room:    cells[1].innerText.trim(),
                gender:  cells[2].innerText.trim(),
                phone:   cells[3].innerText.trim(),
                unit:    cells[4].innerText.trim(),
                grade:   cells[5].innerText.trim(),
                carNo:   cells[6].innerText.trim(),
                el:      row
            });
        });
        return persons;
    }

    // function openSheet(person, allPersons) {
    //     // Highlight row
    //     document.querySelectorAll('.selected-row').forEach(r => r.classList.remove('selected-row'));
    //     person.el.classList.add('selected-row');

    //     // Card 1: Thông tin cá nhân
    //     document.getElementById('sheetPersonInfo').innerHTML = `
    //         <div class="info-row"><span class="info-label">Họ tên</span><span class="info-value">${person.name}</span></div>
    //         <div class="info-row"><span class="info-label">Giới tính</span><span class="info-value">${person.gender}</span></div>
    //         <div class="info-row"><span class="info-label">Điện thoại</span><span class="info-value">${person.phone || '—'}</span></div>
    //         <div class="info-row"><span class="info-label">Đơn vị</span><span class="info-value">${person.unit}</span></div>
    //         <div class="info-row"><span class="info-label">Hạng phòng</span><span class="info-value">${person.grade}</span></div>
    //         <div class="info-row"><span class="info-label">Số xe</span><span class="info-value" style="color:#c96f0e">Xe số ${person.carNo}</span></div>
    //     `;

    //     // Card 2: Đồng hành trên xe
    //     const carMates = allPersons.filter(p => p.carNo === person.carNo && p.name !== person.name);
    //     document.getElementById('sheetCarInfo').innerHTML = carMates.length
    //         ? carMates.map(p => personChip(p)).join('')
    //         : '<div style="color:#8aa9c4;font-style:italic">Không có ai cùng xe</div>';

    //     // Card 3: Bạn cùng phòng (cùng hạng phòng + cùng số xe để lọc gần đúng)
    //     const roomMates = allPersons.filter(p =>
    //         p.grade === person.grade &&
    //         p.carNo === person.carNo &&
    //         p.name !== person.name
    //     );
    //     document.getElementById('sheetRoomInfo').innerHTML = roomMates.length
    //         ? roomMates.map(p => personChip(p)).join('')
    //         : '<div style="color:#8aa9c4;font-style:italic">Phòng đơn hoặc chưa xác định</div>';

    //     // Mở sheet
    //     const overlay = document.getElementById('personSheet');
    //     overlay.classList.add('active');
    // }

    function openSheet(person, allPersons) {
    // Highlight row
    document.querySelectorAll('.selected-row').forEach(r => r.classList.remove('selected-row'));
    person.el.classList.add('selected-row');

    // Card 1: Thông tin cá nhân
    document.getElementById('sheetPersonInfo').innerHTML = `
        <div class="info-row"><span class="info-label">Họ tên</span><span class="info-value">${person.name}</span></div>
        <div class="info-row"><span class="info-label">Giới tính</span><span class="info-value">${person.gender}</span></div>
        <div class="info-row"><span class="info-label">Điện thoại</span><span class="info-value">${person.phone || '—'}</span></div>
        <div class="info-row"><span class="info-label">Đơn vị</span><span class="info-value">${person.unit}</span></div>
        <div class="info-row"><span class="info-label">Hạng phòng</span><span class="info-value">${person.grade}</span></div>
        <div class="info-row"><span class="info-label">Số xe</span><span class="info-value" style="color:#c96f0e">Xe số ${person.carNo}</span></div>
    `;

    // Card 2: Đồng hành trên xe
         const carMates = allPersons.filter(p => p.carNo === person.carNo && p.name !== person.name);
            document.getElementById('sheetCarInfo').innerHTML = carMates.length
                ? carMates.map(p => personChip(p)).join('')
                : '<div style="color:#8aa9c4;font-style:italic">Không có ai cùng xe</div>';

            // Card 3: Bạn cùng phòng
            const roomMates = allPersons.filter(p =>
                p.grade === person.grade &&
                p.carNo === person.carNo &&
                p.name !== person.name
            );
            document.getElementById('sheetRoomInfo').innerHTML = roomMates.length
                ? roomMates.map(p => personChip(p)).join('')
                : '<div style="color:#8aa9c4;font-style:italic">Phòng đơn hoặc chưa xác định</div>';

            // GSAP animation
            const overlay = document.getElementById('personSheet');
            const container = overlay.querySelector('.sheet-container');

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

    function personChip(p) {
        const initials = p.name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();
        const femaleClass = p.gender === 'Nữ' ? 'female' : '';
        return `
            <div class="person-chip">
                <div class="person-avatar ${femaleClass}">${initials}</div>
                <div>
                    <div class="person-name">${p.name}</div>
                    <div class="person-unit">${p.unit}</div>
                </div>
            </div>
        `;
    }

    

    // Gắn click vào từng tr
    function bindTableRows() {
        const allPersons = getAllPersons();
        document.querySelectorAll('#tableBody tr:not(.no-result-row)').forEach((row, i) => {
            row.style.cursor = 'pointer';
            row.addEventListener('click', () => openSheet(allPersons[i], allPersons));
        });
    }

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
})();