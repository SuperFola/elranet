function loadContainersList() {
    fetch('/api/containers', {
        method: 'GET',
    })
    .then(res => res.json())
    .then(json => {
        let tbody = document.getElementById('container_list');
        tbody.innerHTML = '';

        for (let container of json) {
            let tr = document.createElement('tr');
                let id = document.createElement('th');
                    id.innerHTML = container.Id.substr(0, 12);
                    id.attributes.scope = "row";
                let name = document.createElement('td');
                    name.innerHTML = container.Names[0];
                let image = document.createElement('td');
                    image.innerHTML = container.Image;
                let cmd = document.createElement('td');
                    cmd.innerHTML = container.Command;
                let state = document.createElement('td');
                    state.innerHTML = container.State;
                let status = document.createElement('td');
                    status.innerHTML = container.Status;

            tr.appendChild(id);
            tr.appendChild(name);
            tr.appendChild(image);
            tr.appendChild(cmd);
            tr.appendChild(state);
            tr.appendChild(status);

            tbody.appendChild(tr);
        }
    });
}