from flask import Blueprint, render_template, request, redirect, url_for
import json
from pathlib import Path

viewpoints_bp = Blueprint('viewpoints', __name__, url_prefix='/viewpoints')

components = [
    {
        'name': 'Simulation Input UI',
        'role': 'Provides the interface to input simulation parameters',
        'interfaces': 'Web application GUI',
        'dependencies': 'Parameter schema, default values'
    },
    {
        'name': 'Simulation Engine',
        'role': 'Processes input parameters and runs simulations',
        'interfaces': 'API endpoints for simulation execution',
        'dependencies': 'Simulation algorithms, computational resources'
    },
    {
        'name': 'Data Storage',
        'role': 'Stores simulation results and metadata',
        'interfaces': 'Database connections, file storage systems',
        'dependencies': 'Database schema, storage capacity'
    },
    {
        'name': 'Visualization Module',
        'role': 'Generates visual representations of simulation results',
        'interfaces': 'Web-based visualization tools, API for data retrieval',
        'dependencies': 'Visualization libraries, data formats'
    }
]

with open(Path(__file__).parent.parent / "static" / "data" / "viewpoint_content.json", encoding="utf-8") as f:
    viewpoint_content = json.load(f)


@viewpoints_bp.route('/science/artifact')
def scienceArtifact():
    desc = viewpoint_content["science"]["artifact_description"]
    url = viewpoint_content["science"]["artifact_url"]

    return render_template('file_input.html', viewpoint="Science", description=desc, url=url)


@viewpoints_bp.route('/science/analysis')
def scienceAnalysis():
    desc = viewpoint_content["science"]["analysis_description"]

    return render_template('viewpoints.html', viewpoint="Science", components=components, description=desc)


@viewpoints_bp.route('/information/artifact')
def informationArtifact():
    desc = viewpoint_content["information"]["artifact_description"]
    url = viewpoint_content["information"]["artifact_url"]

    return render_template('file_input.html', viewpoint="Information", description=desc, url=url)


@viewpoints_bp.route('/information/analysis')
def informationAnalysis():
    desc = viewpoint_content["information"]["analysis_description"]

    return render_template('viewpoints.html', viewpoint="Information", components=components, description=desc)


@viewpoints_bp.route('/computational/artifact')
def computationalArtifact():
    desc = viewpoint_content["computational"]["artifact_description"]
    url = viewpoint_content["computational"]["artifact_url"]

    return render_template('file_input.html', viewpoint="Computational", description=desc, url=url)


@viewpoints_bp.route('/computational/analysis')
def computationalAnalysis():
    desc = viewpoint_content["computational"]["analysis_description"]

    return render_template('viewpoints.html', viewpoint="Computational", components=components, description=desc)


@viewpoints_bp.route('/engineering/artifact')
def engineeringArtifact():
    desc = viewpoint_content["engineering"]["artifact_description"]
    url = viewpoint_content["engineering"]["artifact_url"]

    return render_template('file_input.html', viewpoint="Engineering", description=desc, url=url)


@viewpoints_bp.route('/engineering/analysis')
def engineeringAnalysis():
    desc = viewpoint_content["engineering"]["analysis_description"]

    return render_template('viewpoints.html', viewpoint="Engineering", components=components, description=desc)


@viewpoints_bp.route('/technology/artifact')
def technologyArtifact():
    desc = viewpoint_content["technology"]["artifact_description"]
    url = viewpoint_content["technology"]["artifact_url"]

    return render_template('file_input.html', viewpoint="Technology", description=desc, url=url)


@viewpoints_bp.route('/technology/analysis')
def technologyAnalysis():
    desc = viewpoint_content["technology"]["analysis_description"]

    return render_template('viewpoints.html', viewpoint="Technology", components=components, description=desc)


@viewpoints_bp.route('/add-component', methods=['POST'])
def add_component():
    name = request.form.get('name')
    role = request.form.get('role')
    interfaces = request.form.get('interfaces')
    dependencies = request.form.get('dependencies')
    if name and role and interfaces and dependencies:
        components.append({
            'name': name,
            'role': role,
            'interfaces': interfaces,
            'dependencies': dependencies
        })
    return redirect(request.referrer)


@viewpoints_bp.route('/delete-component/<int:index>', methods=['POST'])
def delete_component(index):
    if 0 <= index < len(components):
        components.pop(index)
    return redirect(request.referrer)


@viewpoints_bp.route('/upload-artifact/<string:viewpoint>', methods=['POST'])
def upload_artifact(viewpoint):
    if 'diagram' not in request.files or request.files['diagram'].filename == '' \
            or viewpoint.lower() not in ['science', 'information', 'computational', 'engineering', 'technology']:
        return redirect(url_for('home.home'))

    return redirect(url_for(f"viewpoints.{viewpoint.lower()}Analysis"))
